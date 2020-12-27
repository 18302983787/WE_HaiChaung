"""
#=============================================================================
#     FileName:
#         Desc: utils 一些公共方法
#       Author: minghao.guan
#        Email: minghao.guan@woqutech.com
#      Version: 0.0.2 修改我的关系逻辑
#   LastChange: 2020-11-10
#      History:
#=============================================================================
"""
import os
from datetime import datetime
from flask import request
import requests

from utils import sqls
from utils import config
from utils.filelog import logger


def id_format(_id):
    """
    将_id变为5位表示
    :param _id:
    :return:
    """
    if len(str(_id)) == 1:
        return "0000{}".format(str(_id + 1))
    elif len(str(_id)) == 2:
        return "000{}".format(str(_id + 1))
    elif len(str(_id)) == 3:
        return "00{}".format(str(_id + 1))
    elif len(str(_id)) == 4:
        return "0{}".format(str(_id + 1))
    else:
        return "{}".format(str(_id + 1))


def name_format(table_name):
    """
    构建uid时需要的表信息
    :param table_name:
    :return:
    """
    if "user" in table_name:
        return "USR"
    elif "act" in table_name:
        return "ACT"
    elif "rec" in table_name:
        return "REC"


def string_where(where_info):
    """
    将字典转换为sql 语句 where后的内容
    :param  dict where_info:字典，键为表字段，值为实际值
    :return string: 拼接好的字段
    """
    tmp_list = [" {} = \"{}\" ".format(k, v) for k, v in where_info.items()]
    return "and".join(tmp_list)


def date_2_string(date):
    # 将datetime类型的数转为字符格式
    if isinstance(date, datetime):
        return date.strftime("%Y-%m-%d")
    return date


def get_relation(ids, conn):
    """
    获取两个用户的关系（单向关注，双向关注）
    :param list ids: id_a, id_b
    :return tuple: 关系元组
        0 表示没有互相关注
        1 表示互相关注
    """
    id_a, id_b = ids
    a = conn.execute_sql_return_res(sqls.GET_RELATION.format(id_a=id_a, id_b=id_b))
    b = conn.execute_sql_return_res(sqls.GET_RELATION.format(id_a=id_b, id_b=id_a))
    a = a[0][0] if a else 0
    b = b[0][0] if b else 0
    # TODO 此处可以增加用户ab的具体关系
    if a == 1 and b == 1:
        return 1
    else:
        return 0


def get_relation_by_session(sessions, conn):
    """
    通过用户session获取两个用户的关系（单向关注，双向关注）
    :param list sessions: sessions_a, sessions_b
    :param conn: 当前的数据库连接
    :return tuple: 关系元组
        0 表示没有互相关注
        1 表示互相关注
    """
    session_a, session_b = sessions
    a = conn.execute_sql_return_res(sqls.GET_RELATION_BY_SESSION.format(session_a=session_a, session_b=session_b))
    b = conn.execute_sql_return_res(sqls.GET_RELATION_BY_SESSION.format(session_a=session_b, session_b=session_a))
    a = a[0][0] if a else 0
    b = b[0][0] if b else 0
    # TODO 此处可以增加用户ab的具体关系
    if a == 1 and b == 1:
        return 1
    elif a == 1 and b == 0:
        return -1
    elif a == 0 and b == 1:
        return -2
    else:
        return 0


def get_access_token():
    access_token_api = f"https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid={config.APP_ID}&" \
                       f"secret={config.APP_SECRET}"
    access_token = requests.get(access_token_api).json()
    logger.info(access_token)
    return access_token["access_token"]


def ocr_id_card(image_url, access_token):
    """
    ocr识别身份证正反面
    :param image_url:
    :param access_token:
    :return: id_card_info :
    人像面:
        {
        'errcode': 0,
        'errmsg': 'ok',
        'type': 'Front',
        'name': '管明皓',
        'id': '61011119940920501X',
        'addr': '西安市新城区长乐东路1号1号楼1门1层1号',
        'gender': '男',
        'nationality': '汉',
        'birth': '1994-09-20',
        'card_property': 4}
    国徽面：
        {
        "errCode": 0,
        "errMsg": "openapi.ocr.idcard:ok",
        "type": "Back",
        "validDate": "20070105-20270105"
        }
    """
    logger.info(f"image url:{image_url}")
    logger.info(f"access token :{access_token}")
    ocr_url = f"https://api.weixin.qq.com/cv/ocr/idcard?type=Front&img_url={image_url}&access_token={access_token}"
    id_card_info = requests.post(ocr_url).json()
    logger.info(f"id_card_info : {id_card_info}")
    return id_card_info
