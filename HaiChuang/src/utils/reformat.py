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
from utils.common_utils import date_2_string, get_relation
from utils.filelog import logger


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
        for k, v in zip(["name", "head_image", "user_session"], infos):
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
