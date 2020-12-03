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

from datetime import datetime

from utils import sqls

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
