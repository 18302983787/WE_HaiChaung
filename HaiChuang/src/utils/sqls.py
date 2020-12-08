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

# 查询用户中心页面
GET_USER_CENTER = """select username, head_image, user_session, score from hc_user where user_session="{user_session}";"""
GET_USER_FANS_NUM = """select count(id) from hc_fans where user_session="{user_session}";"""
GET_USER_FOLLOW_NUM = """select count(id) from hc_fans where fans_session="{user_session}";"""

# 查询用户报名/参加过的活动
GET_USER_ACTIVITY = """select id, uid, actname, act_time, act_detail, posters from (hc_activity as a inner join 
(select  act_id, usr_session from hc_activity_sign where usr_session="{user_session}") as b on 
a.uid=b.act_id) where DATE_FORMAT(act_time,"%Y-%m-%d") {compare} "{today}";
"""

# ======================================================粉丝，关注模块====================================================
# 查询用户粉丝信息
GET_USER_FANS = """select a.usr_id, a.fans_id, a.fans_name, a.fans_session, b.head_image from (select usr_id, fans_id, 
usr_name,  user_session, fans_name, fans_session from hc_fans where user_session="{user_session}") a inner join hc_user 
 b on a.fans_session = b.user_session;"""

# 查询用户关注信息
GET_USER_LIKE = """select a.fans_id as usr_id, a.usr_id as like_id, a.usr_name as like_name, a.user_session, 
b.head_image from (select usr_id, fans_id, usr_name,  user_session, fans_name, fans_session from hc_fans where 
fans_session="{user_session}") as a inner join hc_user as b on a.user_session=b.user_session;"""

# 查询用户ab是否互相关注
GET_RELATION = """SELECT 1 from hc_fans where usr_id = '{id_a}' and fans_id = '{id_b}';"""

# 查询用户是否存在在用户表中
USER_SIGN_UP = """select uid, username, user_session from hc_user where user_session="{}";"""
