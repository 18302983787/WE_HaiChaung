from utils import sqls
from src.utils.hc_database import conn


# res = conn.complex_select(sqls.GET_USER_FANS.format("test_user_session_tony"))
# res_list = []
# for line in res:
#     tmp_dict = {}
#     for k, v in zip(["uid", "name", "head_image", "fans_name", "fans_session"], list(line)):
#         tmp_dict[k] = v
#     res_list.append(tmp_dict)
#
# for i in res_list:
#     print(i)


# res = conn.complex_select(
#     sqls.GET_USER_ACTIVITY.format(user_session="090e54a81a91aa89172202a90c1f2ba6", today=date_2_string(datetime.now())))
# print(res)

# res = conn.execute_sql_return_res(sqls.GET_USER_FANS.format(user_session="test_user_session_tony"))
# print(res)
# print(reformat_my_relation(res))
a = conn.execute_sql_return_res(sqls.GET_RELATION.format(id_a="HC_USR_10001", id_b="HC_USR_10003"))
b = conn.execute_sql_return_res(sqls.GET_RELATION.format(id_a="HC_USR_10003", id_b="HC_USR_10001"))
print(a,b)

