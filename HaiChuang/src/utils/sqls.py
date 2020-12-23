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
# =================================================活动信息模块===========================================================
GET_ACTIVITY = """select c.id, c.uid, c.actname, c.act_detail, c.act_time, c.loc, c.people, c.posters, 
c.people_limit, d.username, d.images from hc_activity as c left join (select a.act_id, 
group_concat(b.username) as username, group_concat(a.usr_session) as session, group_concat(b.head_image) as images 
from hc_activity_sign as a left join (select username, user_session, head_image from hc_user) as b on 
a.usr_session=b.user_session group by a.act_id) as d on c.uid=d.act_id;"""

# =================================================用户中心==============================================================
# 刷新用户头像
UPDATE_USER_HEAD_IMAGE = """update hc_user set head_image="{head_image}" where user_session="{user_session}";"""

# 检查是否实名认证
CHECK_IS_IDENTIFIED = """select name from hc_id_cards where user_session="{user_session}";"""
# 实名认证
INSERT_ID_CARD = """INSERT INTO hc_id_cards({keys}) SELECT "{values}" FROM DUAL WHERE NOT EXISTS(SELECT *  FROM 
hc_id_cards WHERE user_session = "{user_session}");"""

# 查询用户中心页面
GET_USER_CENTER = """select username, head_image, user_session, score from hc_user where user_session="{user_session}";"""
GET_USER_FANS_NUM = """select count(id) from hc_fans where user_session="{user_session}";"""
GET_USER_FOLLOW_NUM = """select count(id) from hc_fans where fans_session="{user_session}";"""

# 查询用户信息详情
GET_PERSONAL_INFO = """select username, head_image, gender, age, birth, loc, graduate from hc_user where user_session="{user_session}";"""
# 未注册用户访问时的用户
GET_DEFAULT_USER_INFO = """select username, head_image, gender, age, birth, loc, graduate from hc_user where 
user_session="hc_default_user_session";"""

# 查询用户报名/参加过的活动
GET_USER_ACTIVITY = """select id, uid, actname, act_time, act_detail, posters from (hc_activity as a inner join 
(select act_id, usr_session from hc_activity_sign where usr_session="{user_session}") as b on 
a.uid=b.act_id) where DATE_FORMAT(act_time,"%Y-%m-%d") {compare} "{today}";"""

# 查询用户点赞的招聘
GET_USER_RECRUIT = """select id, uid, recname, rec_time, likes, views, link from (hc_recruit as a inner join 
(select rec_id, usr_session from hc_recruit_interested where usr_session="{user_session}") as b on 
a.uid=b.rec_id) where DATE_FORMAT(rec_time,"%Y-%m-%d") {compare} "{today}";"""

# 招聘信息阅读次数加一
VIEW_PLUS_ONE = """update hc_recruit set views=views+1 where uid="{uid}"; """
LIKE_PLUS_ONE = """update hc_recruit set likes=likes+1 where uid="{uid}"; """

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
