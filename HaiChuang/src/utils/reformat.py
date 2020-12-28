"""
#=============================================================================
#     FileName:
#         Desc: reformat模块,专门用于解析各种sql语句执行的返回值
#       Author: minghao.guan
#        Email: minghao.guan@woqutech.com
#      Version: 0.0.2 修改我的关系逻辑
#   LastChange: 2020-11-10
#      History:
#=============================================================================
"""
from datetime import datetime

from utils.common_utils import date_2_string, get_relation, get_relation_by_session
from utils.filelog import logger


# 解析我的活动返回值
def reformat_activity(res):
    """
    解析我的活动返回值
    :param res: 活动查询结果
    :return:
    """
    res_list = []
    if not res:
        return res_list
    # 将每一行数据生成的字典添加进列表
    for line in res:
        tmp_dict = {}
        # 先把每一行的数据拼接成字典
        for k, v in zip(["id", "uid", "actname", "act_detail", "act_time", "loc", "people", "posters", "people_limit",
                         "user_names", "user_images"], list(line)):
            if k == "act_time":
                v = date_2_string(v)
            if k in ["user_names", "user_images"]:
                v = v.split(",") if v else v
                tmp_dict[k] = v
                continue
            tmp_dict[k] = str(v)
        res_list.append(tmp_dict)
    return res_list


# 解析我的活动的返回值
def reformat_my_activity(res):
    """
    解析我的活动的返回值
    输入数据：
        ((1, 'HC_ACT_0001', '海归人才英语口语沙龙——《影视品鉴会》', datetime.datetime(2020, 8, 1, 0, 0), '旨在帮助各位海归青年熟悉自己曾经流利的英语的沙龙活动', b''),
         (2, 'HC_ACT_0002', '青年人才在西安——海归人才桌游联谊活动', datetime.datetime(2020, 7, 25, 0, 0), '狼人杀桌游联谊活动，旨在交流和分享以及认识新的伙伴', b''),
         (3, 'HC_ACT_0003', '青年人才在西安---相约冬至 相约幸福', datetime.datetime(2019, 12, 22, 0, 0), '过开展青年才俊才艺展示、创业和职业发展个人分享、互动游戏、集体包饺子等多种活动形式，相互学习、加深了解、充分交流、增进友谊。', b''))
    :param tuple res:
    :return list:
        [
    	{
            act_detail: "旨在帮助各位海归青年熟悉自己曾经流利的英语的沙龙活动"
            act_time: "2020-08-01"
            actname: "海归人才英语口语沙龙——《影视品鉴会》"
            id: 1
            uid: "HC_ACT_0001"
		},
        {
            act_detail: "狼人杀桌游联谊活动，旨在交流和分享以及认识新的伙伴"
            act_time: "2020-07-25"
            actname: "青年人才在西安——海归人才桌游联谊活动"
            id: 2
            uid: "HC_ACT_0002"
        }
	]
    """
    res_list = []
    if not res:
        return res_list
    # 将每一行数据生成的字典添加进列表
    for line in res:
        tmp_dict = {}
        # 先把每一行的数据拼接成字典
        # TODO 增加poster的返回值
        for k, v in zip(["id", "uid", "actname", "act_time", "act_detail", "posters"], list(line)):
            if k == "act_time":
                v = date_2_string(v)
            tmp_dict[k] = str(v)
        res_list.append(tmp_dict)
    return res_list


# 解析我赞过的招聘的返回值
def reformat_my_recruit(res):
    """
        解析我赞过的招聘的返回值
        输入数据：
            ((1, 'HC_REC_0001', '西安铂力特增材技术股份有限公司', datetime.datetime(2020, 8, 11, 0, 0), 2, 27, 'https://mp.weixin.qq.com/s/X_jWaADfpp1x8gXuZRgwXA'),)
        :param tuple res:
        :return list:
            [
        	{
                act_detail: "旨在帮助各位海归青年熟悉自己曾经流利的英语的沙龙活动"
                act_time: "2020-08-01"
                actname: "海归人才英语口语沙龙——《影视品鉴会》"
                id: 1
                uid: "HC_ACT_0001"
    		},
            ...
    	]
        """
    res_list = []
    if not res:
        return res_list
    # 将每一行数据生成的字典添加进列表
    for line in res:
        tmp_dict = {}
        # 先把每一行的数据拼接成字典
        for k, v in zip(["id", "uid", "rec_name", "rec_time", "likes", "views", "link"], list(line)):
            if k == "rec_time":
                v = date_2_string(v)
            tmp_dict[k] = str(v)
        res_list.append(tmp_dict)
    return res_list


def reformat_my_relation(res, conn):
    """
    解析我的粉丝的返回值
    :param tuple res:
      输入数据：
      (
       ('HC_USR_10001', 'HC_USR_10002', 'Steven', 'test_user_session_steven', 'test_head_image_steve'),
       ('HC_USR_10001', 'HC_USR_10003', 'Nat', 'test_user_session_nat', 'test_head_image_nat')
       )

    :return list:
       [
        {'name': 'Steven', 'head_image': 'test_user_session_steven', 'user_session': 'test_head_image_steve', 'relation': '0'},
        {'name': 'Nat', 'head_image': 'test_user_session_nat', 'user_session': 'test_head_image_nat', 'relation': '0'}
        ]
    """
    res_list = []
    # 将每一行数据生成的字典添加进列表
    if not res:
        return res_list
    for line in res:
        # 用于存储用户信息字典
        tmp_dict = {}
        # usr_id, fans_id 组成ids 用来查找关系； infos用来拼接数据
        ids, infos = list(line)[:2], list(line)[2:]
        # 先把每一行的数据拼接成字典
        for k, v in zip(["name", "user_session", "head_image"], infos):
            logger.info(f"{k},{v}")
            tmp_dict[k] = v
        # 查找用户与粉丝的关系
        tmp_dict["relation"] = get_relation(ids, conn)
        res_list.append(tmp_dict)
    return res_list


def reformat_user_info(user_info, fans_num, follow_num):
    """
    解析用户信息
    :param user_info:
    :param fans_num:
    :param follow_num:
    :return:

    eg:
    user_info:(('管明皓', 'test', '090e54a81a91aa89172202a90c1f2ba6'),)
    fans_num:((0,),)
    follow_num:((0,),)
    """
    if not user_info or not fans_num or not follow_num:
        logger.error(
            f"【用户中心】用户信息获取失败，返回值中存在none。返回值: user_info:{user_info}, fans_num:{fans_num}, follow_num:{follow_num}")
    username, head_image, user_session, score = user_info[0]
    fans_num = fans_num[0][0]
    follow_num = follow_num[0][0]
    return {"username": username,
            "head_image": head_image,
            "score": score,
            "fans_num": fans_num,
            "follow_num": follow_num}


def reformat_personal_info(personal_info):
    """
    解析用户个人信息详情页数据
    :param personal_info:
    :return:
    eg:

    """
    personal_info = personal_info[0]
    return {"username": personal_info[0],
            "head_image": personal_info[1],
            "gender": personal_info[2],
            "age": personal_info[3],
            "birth": personal_info[4],
            "loc": personal_info[5],
            "graduate": personal_info[6]}


def reformat_ocr_id(id_a, id_b, user_session):
    """
    身份证信息解析
    :param dict id_a: 人像面信息
    :param dict id_b: 国徽面信息
    :param str user_session: 用户session
    :return:
    """
    id_info = dict()
    id_info["name"] = id_a.get("name")
    id_info["id_num"] = id_a.get("id")
    id_info["addr"] = id_a.get("addr")
    id_info["gender"] = id_a.get("gender")
    id_info["nationality"] = id_a.get("nationality")
    id_info["birth"] = id_a.get("birth")
    id_info["valid_date"] = id_b.get("valid_date")
    id_info["user_session"] = user_session
    return id_info


# 解析活动报名人数返回值
def reformat_activity_signers(user_session, res, conn):
    """

    :param user_session:
    :param res:
    :param conn:
    :return:
    """
    res_list = []
    if not res:
        return res_list
    # 将每一行数据生成的字典添加进列表
    for line in res:
        tmp_dict = {}
        # 先把每一行的数据拼接成字典
        for k, v in zip(["act_uid", "user_session", "username", "age", "gender", "head_image"], list(line)):
            tmp_dict[k] = str(v)
        if tmp_dict["user_session"] == user_session:
            continue
        tmp_dict["relation"] = get_relation_by_session(sessions=[user_session, tmp_dict["user_session"]], conn=conn)
        res_list.append(tmp_dict)
    return res_list


# 解析积分查询结果及计算相对应的段位
def reformat_score_and_level(res):
    """
    解析积分查询结果及计算相对应的段位
    :param res: 积分查询结果
    :return:
    """
    if not res:
        return res
    score, is_sign_today = res[0]
    level = _get_level(score)
    return score, level, is_sign_today


def reformat_daily_attendance(res):
    """
    解析用户签到表
    :param res:
    :return:
    """
    res_list = []
    # 将每一行数据生成的字典添加进列表
    if not res:
        return res_list
    for line in res:
        tmp_dict = {}
        # 先把每一行的数据拼接成字典
        for k, v in zip(["id", "user_session", "is_sign_today", "constant_sign", "last_sign"], list(line)):
            logger.info(f"{k}: {v}")
            if k == "last_sign":
                tmp_dict[k] = v if v else datetime.now()
            else:
                tmp_dict[k] = v
        res_list.append(tmp_dict)
    return res_list


def _get_level(score):
    """
    计算级别
    :param int score: 当前积分
    :return str level: 当前等级
    """
    if score < 20:
        return "童生"
    elif 20 <= score <= 40:
        return "秀才"
    elif 40 <= score <= 100:
        return "贡生"
    elif 100 <= score <= 500:
        return "举人"
    elif 500 <= score <= 1000:
        return "探花"
    elif 1000 <= score <= 2000:
        return "榜眼"
    elif 2000 <= score <= 4000:
        return "状元"
