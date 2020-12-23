import os

import requests
import hashlib
from flask import Flask
from flask import render_template
from flask import json

from utils.hc_database import *
from utils.common_utils import *
from utils import sqls
from utils import config
from utils.filelog import logger
from utils import constants
from utils.reformat import *

app = Flask(__name__)


@app.route('/')
def haichuang_web():
    return render_template("/home/haichuang/hc_server/templates/haichuang_web.html")


# 登录
@app.route('/api/onLogin', methods=['GET', 'POST'])
def login():
    logger.info(constants.START_API_LOG.format("登录"))
    data = request.values.get("code")
    appid = config.APP_ID
    app_secret = config.APP_SECRET
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


# 请求数据 先暂用与活动招聘页面
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


# 活动页面请求重构
@app.route("/api/get_activity", methods=['POST'])
def get_activity():
    user_session = request.values.get("user_session")
    conn = HCDataBase()
    format_res = {"status": "error", "data": list()}
    try:
        res = conn.execute_sql_return_res(sqls.GET_ACTIVITY)
        reformat_res = reformat_activity(res)
        format_res["status"] = "success"
        format_res["data"] = reformat_res
    except Exception as e:
        logger.exception(e)
    return format_res


# 请求个人信息
@app.route("/api/get_user_info", methods=['POST'])
def get_user_info():
    user_session = request.values.get("user_session")
    conn = HCDataBase()
    format_res = {"status": "error", "data": dict()}
    if user_session:
        user_info = conn.execute_sql_return_res(sqls.GET_USER_CENTER.format(user_session=user_session))
        fans_num = conn.execute_sql_return_res(sqls.GET_USER_FANS_NUM.format(user_session=user_session))
        follow_num = conn.execute_sql_return_res(sqls.GET_USER_FOLLOW_NUM.format(user_session=user_session))
        is_identified = "True" if conn.execute_sql_return_res(
            sqls.CHECK_IS_IDENTIFIED.format(user_session=user_session)) else "False"
    else:
        user_info = conn.execute_sql_return_res(sqls.GET_USER_CENTER.format(constants.UNDEFINED))
        fans_num = "0"
        follow_num = "0"
        is_identified = "False"
    try:
        reformat_data = reformat_user_info(user_info, fans_num, follow_num)
        reformat_data["is_identified"] = is_identified
        format_res["data"] = reformat_data
        format_res["status"] = "success"
        logger.info(f"用户{user_session}的信息是：{reformat_data}")
    except Exception as e:
        logger.error(f"用户{user_session}个人信息页面处理失败")
        logger.exception(e)
    return format_res


# 身份证ocr识别
@app.route("/api/identify", methods=['POST'])
def identify():
    user_session = request.values.get("user_session")
    id_a = request.values.get("id_a")
    id_b = request.values.get("id_b")
    access_token = get_access_token()
    # 人像面结果
    ocr_id_a = ocr_id_card(id_a, access_token)
    # 国徽面结果
    ocr_id_b = ocr_id_card(id_b, access_token)
    # 处理返回结果并以字典形式返回
    reformat_res = reformat_ocr_id(ocr_id_a, ocr_id_b, user_session)
    logger.info(f"[身份证ocr识别] reformat结果:{reformat_res}")
    format_res = {"status": "error"}
    if ocr_id_a["errcode"] == 0 and ocr_id_b["errcode"] == 0:
        format_res = {"status": "success"}
        # TODO 认证信息存储
        conn = HCDataBase()
        conn.execute_sql(
            sqls.INSERT_ID_CARD.format(keys=",".join(reformat_res.keys()), values="\",\"".join(reformat_res.values()),
                                       user_session=user_session))
    else:
        logger.error(
            f"【error】 id card info request failed. error code: {ocr_id_a.get('errcode')}. error msg: {ocr_id_a.get('errmsg')}")

    return format_res


# 上传身份证图片
@app.route("/api/upload_ocr_pic", methods=["POST"])
def upload_ocr_pic():
    """
    本地存储ocr图片并返回路径
    :return: path图片的保存路径及名称
    """
    ocr_pic = request.files.get("ocr_pic_file")
    user_session = request.form.get("user_session")
    if user_session:
        logger.info(f"用户{user_session}正在上传身份证照片")
    else:
        logger.error(f"未获取到用户session")
    pic_type = request.form.get("type")
    path = ""
    try:
        ocr_pic.save(os.path.join(config.OCR_PIC_SAVE_PATH, f"{user_session}_{pic_type}.jpg"))
        logger.info(f"【info】ocr图片上传成功，类型{pic_type}")
        path = config.OCR_UPLOAD_FILE_URL.format(file_name=f"{user_session}_{pic_type}.jpg")
    except Exception as e:
        logger.error("【error】ocr图像上传失败")
        logger.exception(e)
    return path


# 上传头像
@app.route("/api/update_head_image", methods=["POST"])
def update_head_image():
    """
    刷新用户头像
    :return:
    """
    head_image_url = request.values.get("head_image_url")
    user_session = request.values.get("user_session")
    res = {"status": "error"}
    conn = HCDataBase()
    if user_session:
        logger.info(f"用户{user_session}正在更新头像")
        try:
            conn.execute_sql(sqls.UPDATE_USER_HEAD_IMAGE.format(user_session=user_session, head_image=head_image_url))
            logger.info(f"【info】头像更新成功")
            res["status"] = "success"
        except Exception as e:
            logger.error("【error】头像更新失败")
            logger.exception(e)
    else:
        logger.error(f"未获取到用户session")
    return res


# 请求个人资料页面
@app.route("/api/get_personal_info", methods=['POST'])
def get_personal_info():
    user_session = request.values.get("user_session")
    conn = HCDataBase()
    format_res = {"status": "error", "data": dict()}
    if user_session:
        personal_info = conn.execute_sql_return_res(sqls.GET_PERSONAL_INFO.format(user_session=user_session))
    else:
        personal_info = conn.execute_sql_return_res(sqls.GET_DEFAULT_USER_INFO)
    try:
        reformat_data = reformat_personal_info(personal_info)
        format_res["data"] = reformat_data
        format_res["status"] = "success"
        logger.info(f"用户{user_session}的信息是：{reformat_data}")
    except Exception as e:
        logger.info("个人资料信息解析失败")
        logger.exception(e)
    return format_res


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


# 请求我的招聘
@app.route("/api/get_my_recruit", methods=["POST"])
def get_my_recruit():
    """
    请求我赞过的招聘
    :return dict:
    """
    user_session = request.values.get("user_session")
    get_type = request.values.get("get_type")
    logger.info(f"【api-get_my_recruit】user_session:{user_session}\tget_type:{get_type}")
    conn = HCDataBase("HaiChuang")
    reformat_res = []
    try:
        res = conn.execute_sql_return_res(sqls.GET_USER_RECRUIT.format(user_session=user_session,
                                                                       compare=constants.SMALLER if get_type == constants.EXPIRED else constants.LARGER,
                                                                       today=date_2_string(datetime.now())))
        reformat_res = reformat_my_recruit(res)
        if not reformat_res:
            logger.warning(f"用户{user_session}没有赞过招聘信息哦!")
        else:
            logger.info(f"用户{user_session} {get_type}的关注招聘是{reformat_res}")
        status = "success"
    except Exception as e:
        logger.error(e)
        status = "error"
    return {"status": status,
            "data": reformat_res,
            "length": len(reformat_res)}


# 刷新文章的阅读量
@app.route("/api/view_plus_one", methods=["POST"])
def view_plus_one():
    """
    招聘信息浏览量刷新
    :return:
    """
    user_session = request.values.get("user_session")
    uid = request.values.get("rec_uid")
    logger.info(f"【api-view_plus_one】 user_session:{user_session}")
    conn = HCDataBase("HaiChuang")
    try:
        conn._execute_sql(sqls.VIEW_PLUS_ONE.format(uid=uid))
        status = "success"
    except Exception as e:
        logger.error(e)
        status = "error"
    return {"status": status}


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


# 点赞招聘
@app.route("/api/get_interested", methods=["POST"])
def get_interested():
    """
    点赞招聘
    :return:
        res -> dict
            - response insert的返回值
            - is_interested 是否报名
    """
    logger.info("+++++++++++++++++++++【开始】点赞招聘模块+++++++++++++++++++++++++++")
    rec_interest = dict()
    rec_interest["rec_id"] = request.values.get("rec_id")
    rec_interest["usr_session"] = request.values.get("usr_session")
    table_name = "hc_recruit_interested"
    conn = HCDataBase("HaiChuang")
    logger.info("【interested】 : ", rec_interest)
    select_res = conn.select(table_name, fields="is_interested", where=string_where(rec_interest))
    if select_res:
        status = "signed"
    else:
        # step3：如果没有点赞过则立刻点赞。
        rec_interest["is_interested"] = 1  # sql中1是True 0是false
        response = conn.insert(table_name, rec_interest)
        status = response if response == "success" else "error"
        try:
            conn._execute_sql(sqls.LIKE_PLUS_ONE.format(uid=rec_interest["rec_id"]))
            logger.info("点赞后同步修改表中的like数量成功")
        except Exception as e:
            logger.info("点赞后同步修改表中的like数量失败")
            logger.error(e)
    logger.info("+++++++++++++++++++++【结束】点赞招聘模块+++++++++++++++++++++++++++")

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
    type_ = request.values.get("type").strip()
    conn = HCDataBase("HaiChuang")
    reformat_res = []
    try:
        if type_ == "fans":
            res = conn.execute_sql_return_res(sqls.GET_USER_FANS.format(user_session=user_session))
        else:
            res = conn.execute_sql_return_res(sqls.GET_USER_LIKE.format(user_session=user_session))
        reformat_res = reformat_my_relation(res, conn)
        status = "success"
    except Exception as e:
        logger.exception(e)
        status = "error"
    return {"status": status,
            "data": reformat_res}


# # 请求页面海报
# @app.route("/api/get_img_url")
# def get_img_url():
#     imgs = os.listdir("/home/haichuang/hc_data/imgs/images/")
#     pass


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
