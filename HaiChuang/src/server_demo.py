import requests
import hashlib
from flask import Flask
from flask import render_template
from flask import request
from flask import json

from utils.hc_database import *
from utils.common_utils import *
from utils import sqls
from utils.filelog import logger
from utils import constants
from utils.reformat import *

app = Flask(__name__)


@app.route('/')
def haichuang_web():
    return render_template("template/haichuang_web.html")


# 登录
@app.route('/api/onLogin', methods=['GET', 'POST'])
def login():
    logger.info(constants.START_API_LOG.format("登录"))
    data = request.values.get("code")
    appid = "wx04be3367dc046a40"
    app_secret = '8eed51d12d94160f3e8f4b50fc86d1f8'
    req_params = {
        'appid': appid,
        'secret': app_secret,
        'js_code': data,
        'grant_type': 'authorization_code'
    }
    code_2_session = "https://api.weixin.qq.com/sns/jscode2session"
    response_data = requests.get(code_2_session, params=req_params)  # 向API发起GET请求
    res_data = response_data.json()
    openid = res_data['openid']  # 得到用户关于当前小程序的OpenID
    # session_key = res_data['session_key']
    md5 = hashlib.md5()
    md5.update(openid.encode("utf-8"))
    user_session = md5.hexdigest()
    conn = HCDataBase("HaiChuang")
    # 查找表中是否有用户信息
    res = conn.execute_sql_return_res(sqls.USER_SIGN_UP.format(user_session))
    if res:
        user_info = {"user_session": user_session, "status": "success"}
    else:
        user_info = {"user_session": user_session, "status": "failed"}

    return json.dumps(user_info)


# 请求数据
@app.route("/api/request_info", methods=['POST'])
def get_info():
    table_name = request.values.get("table")
    user_session = request.values.get("user_session")
    conn = HCDataBase()
    if user_session:
        res = conn.select(table_name, where=string_where({"user_session": user_session}))
    else:
        res = conn.select(table_name)
    return res


# 请求我的活动
@app.route("/api/get_my_activity", methods=["POST"])
def get_my_activity():
    """
    请求我的活动
    :return dict:
    """
    user_session = request.values.get("user_session")
    get_type = request.values.get("get_type")
    logger.info(f"【api-get_my_activity】user_session:{user_session}\tget_type:{get_type}")
    conn = HCDataBase("HaiChuang")
    reformat_res = []
    try:
        res = conn.execute_sql_return_res(sqls.GET_USER_ACTIVITY.format(user_session=user_session,
                                                                        compare=constants.SMALLER if get_type == constants.EXPIRED else constants.LARGER,
                                                                        today=date_2_string(datetime.now())))
        reformat_res = reformat_my_activity(res)
        if not reformat_res:
            logger.warning(f"用户{user_session}没有待参加的活动哦!")
        else:
            logger.info(f"用户{user_session} {get_type}的活动是{reformat_res}")
        status = "success"
    except Exception as e:
        logger.error(e)
        status = "error"
    return {"status": status,
            "data": reformat_res,
            "length": len(reformat_res)}


# 报名
@app.route("/api/sign_up", methods=["POST"])
def sign_act():
    """
    报名函数
        检查活动是否人数已满
        是 --> 返回full
        否 -->
            检查是否报名
            是 --> 返回signed
            否 --> 报名
                成功 --> 返回success
                失败 --> 返回error

        - request包含表名，活动uid和用户session
    :return:
        res -> dict
            - response insert的返回值
            - is_signed 是否报名
    """
    table_name = request.values.get("table_name")
    sign_info = dict()
    sign_info["act_id"] = request.values.get("act_uid")
    # step1:检查活动是否人数已满
    # TODO 高并发处理方法
    # if check_act_is_full(sign_info["act_id"]):
    #     return "full"
    # step2:检查是否已经报名
    sign_info["usr_session"] = request.values.get("user_session")
    conn = HCDataBase("HaiChuang")
    logger.info("【sign-up】 : ", sign_info)
    select_res = conn.select(table_name, fields="is_sign", where=string_where(sign_info))
    if select_res:
        status = "signed"
    else:
        # step3：如果没有报名则立刻报名。
        sign_info["is_sign"] = 1  # sql中1是True 0是false
        response = conn.insert(table_name, sign_info)
        status = response if response == "success" else "error"
    res = {"status": status}
    return res


# 注册
@app.route("/api/register", methods=["POST"])
def register():
    """
    注册函数
    :return:
    """
    table_name = request.values.get("table_name")
    register_info = dict()
    # register_info["uid"] = request.values.get("table_length")
    register_info["user_session"] = request.values.get("user_session")
    register_info["head_image"] = request.values.get("head_image")
    register_info["username"] = request.values.get("username")
    register_info["phone"] = request.values.get("phone")
    register_info["gender"] = request.values.get("gender")
    register_info["age"] = request.values.get("age")
    register_info["birth"] = request.values.get("birth")
    register_info["loc"] = request.values.get("loc")
    register_info["graduate"] = request.values.get("graduate")
    conn = HCDataBase("HaiChuang")
    response = conn.insert(table_name, register_info)
    res = {"response": response}
    return json.dumps(res)


# 请求我的粉丝信息
@app.route("/api/get_my_relation", methods=["POST"])
def get_my_relation():
    """
    【请求】获取我的粉丝
    :return dict: 粉丝列表
    {"status": success,
     "data":
       [
        {'name': 'Steven', 'head_image': 'test_user_session_steven', 'user_session': 'test_head_image_steve', 'relation': '0'},
        {'name': 'Nat', 'head_image': 'test_user_session_nat', 'user_session': 'test_head_image_nat', 'relation': '0'}
       ]

     }
    """
    user_session = request.values.get("user_session")
    type = request.values.get("type").strip()
    conn = HCDataBase("HaiChuang")
    reformat_res = []
    try:
        if type == "fans":
            res = conn.execute_sql_return_res(sqls.GET_USER_FANS.format(user_session))
        else:
            res = conn.execute_sql_return_res(sqls.GET_USER_LIKE.format(user_session))
        reformat_res = reformat_my_relation(res)
        status = "success"
    except Exception as e:
        logger.error(e)
        status = "error"
    return {"status": status,
            "data": reformat_res}


# # 请求我的关注信息
# @app.route("/api/get_my_like")
# def get_my_fans():
#     """
#     【请求】获取我的关注
#     :return dict: 关注列表
#     {"status": success,
#      "data":
#        [{'user_session': 'session', 'usr_name': 'gmh', 'other_name': 'a'},
#         {'user_session': 'session', 'usr_name': 'gmh', 'other_name': 'b'},
#         {'user_session': 'session', 'usr_name': 'gmh', 'other_name': 'c'},
#         {'user_session': 'session', 'usr_name': 'gmh', 'other_name': 'd'},
#         {'user_session': 'session', 'usr_name': 'gmh', 'other_name': 'sx'}]
#
#      }
#     """
#     user_session = request.values.get("user_session")
#     conn = DataBase("HaiChuang")
#     reformat_res = []
#     try:
#         res = conn.complex_select(sqls.GET_USER_LIKE.format(user_session))
#         reformat_res = reformat_my_fans_like(res)
#         status = "success"
#     except Exception as e:
#         logger.error(e)
#         status = "error"
#     return {"status": status,
#             "data": reformat_res}


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
