"""
#=============================================================================
#     FileName:
#         Desc: sql语句模板文件
#       Author: minghao.guan
#        Email: minghao.guan@woqutech.com
#      Version: 0.0.1
#   LastChange: 2020-11-03
#      History:
#=============================================================================
"""

import json
import pymysql

from utils.filelog import logger
from utils.config import *
from utils.common_utils import *

class HCDataBase:
    def __init__(self, db_name="HaiChuang"):
        self.conn = pymysql.Connect(host=LOCALHOST, port=SQL_PORT,
                                    user=SQL_USER, passwd=SQL_PSD,
                                    db=db_name, charset="utf8")

    def insert(self, table_name, data_dict):
        """
        insert
            - default
                默认插入用户，活动，招聘信息时。需要先获取表内的最后一位id，用于拼接uid
            - 活动报名
                报名时，无需检查id。按照规律递增即可。
        :param table_name:
        :param data_dict:
        :return:
        """
        # 如果是插入报名表则不需要计算uid 直接插入即可
        if table_name != "hc_activity_sign":
            # 先查看当前表格的id是多少
            _sql = "SELECT id from {} order by id DESC limit 1;".format(
                table_name)
            # _id = str(int(self._execute_sql(_sql) + 1))
            _id = self._execute_sql(_sql)
            _name = name_format(table_name)
            if _id:
                data_dict["uid"] = "HC_{}_{}".format(_name,
                                                     id_format(_id[0][0]))
            else:
                data_dict["uid"] = "HC_{}_00001".format(_name)

        keys = data_dict.keys()
        values = [str(i) for i in data_dict.values()]
        sql = "INSERT INTO {} ({}) VALUES ('{}');".format(table_name, ",".join(
            keys), "','".join(values))
        res = self._execute_sql(sql, insert=True)
        # 插入是否成功
        if res == "failed":
            logger.error("【insert failed】 sql:'{}'".format(sql))
            return "failed"
        else:
            logger.info("【insert success】 sql:'{}'".format(sql))
            return "success"

    def select(self, table_name, fields="*", where=None):
        """
        简单查询
        :param table_name: 表名称
        :param fields:查询内容
        :param where:条件字段
        :return json:查寻结果
        """

        # 获取查询表的表头
        table_info = [i[0] for i in self.show_table(table_name)]
        if where:
            sql = "SELECT {} FROM {} WHERE {};".format(fields, table_name, where)
        else:
            sql = "SELECT {} FROM {};".format(fields, table_name)
        res = self._execute_sql(sql)
        act_res = {}
        if res:
            print("【success】 sql:'{}'".format(sql))
            res = [dict(zip([col for col in table_info], row)) for row in res]
            # 将datetime格式数据修改为str
            for i, act in enumerate(res):
                for k, v in act.items():
                    if isinstance(v, datetime):
                        act[k] = act[k].strftime("%Y-%m-%d")
                    if isinstance(v, bytes):
                        act[k] = str(act[k], encoding="utf-8")
                    if isinstance(v, str) and "@" in v:
                        act[k] = act[k].split("@") if act[k].split("@")[
                            -1] else [act[k][:-1]]
                act_res[i] = act
            return json.dumps(act_res, ensure_ascii=False)

    def execute_sql_return_res(self, sql):
        """
        执行复杂嵌套查询语句
        :param sql: 具体sql
        :return boolean:
        """
        res = self._execute_sql(sql)
        if res == "success":
            logger.info("【success】sql:{}".format(sql))
        return res

    def show_table(self, table_name=None):
        if table_name:
            sql = "desc {};".format(table_name)
        else:
            sql = "show tables;"
        res = self._execute_sql(sql)
        if res:
            logger.info("【success】sql:{}".format(sql))
            return res

    def close(self):
        self.conn.close()

    def _execute_sql(self, sql, insert=False):
        # 执行sql语句
        logger.info(f"【sql】:{sql}")
        cursor = self.conn.cursor()
        try:
            cursor.execute(sql)
            self.conn.commit()
        except Exception as e:
            logger.error("【failed】 sql:’{}’ reason: {}".format(sql, e))
            self.conn.rollback()
            return "failed"
        if insert:
            cursor.close()
            return "success"
        else:
            res = cursor.fetchall()
            cursor.close()
            return res if res else None


if __name__ == '__main__':
    conn = HCDataBase("HaiChuang")
