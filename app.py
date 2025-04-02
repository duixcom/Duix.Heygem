import os
import uuid
import time
import json
import requests
import gradio as gr
import shutil
import argparse
from pydub import AudioSegment

# 命令行参数解析
parser = argparse.ArgumentParser(description='HeyGem数字人训练与合成系统')
parser.add_argument('--lang', type=str, default='en', choices=['zh', 'en'], help='界面语言 (zh: 中文, en: 英文)')
args = parser.parse_args()

# 翻译字典
translations = {
    'zh': {
        'title': '数字人训练与合成系统',
        'paths_info': '存储路径信息',
        'audio_path': '音频文件存储路径',
        'video_path': '视频文件存储路径',
        'api_server1': 'API服务器地址1',
        'api_server2': 'API服务器地址2',
        'train_tab': '数字人训练',
        'upload_video': '上传参考视频',
        'model_name': '数字人名称',
        'current_status': '当前状态',
        'ready': '就绪',
        'start_training': '开始训练',
        'trained_models': '已训练的数字人',
        'training_result': '训练结果',
        'synthesis_tab': '数字人合成',
        'select_model': '选择数字人模型',
        'text_input_tab': '文字输入',
        'input_text': '输入文字内容',
        'synthesize': '合成',
        'audio_upload_tab': '音频上传',
        'upload_audio': '上传音频文件',
        'task_id': '任务ID',
        'synthesis_status': '合成状态',
        'synthesis_result': '合成结果',
        'query_status': '查询合成状态',
        'refresh_models': '刷新数字人模型列表',
        'error_no_video': '错误: 请上传视频文件',
        'error_no_name': '错误: 请输入数字人名称',
        'processing_video': '正在处理视频...',
        'error_no_model': '错误: 请选择数字人模型',
        'error_no_text': '错误: 请输入文字内容',
        'processing_text': '正在处理文字转语音...',
        'error_no_audio': '错误: 请上传音频文件',
        'processing_audio': '正在处理音频...',
        'enter_task_id': '请输入任务ID',
        'upload_video_and_name': '请上传视频文件并输入数字人名称',
        'training_error': '训练过程出错: {0}\n详细错误: {1}',
        'training_success': '训练成功! 模型ID: {0}',
        'api_response_error': '训练失败: API响应错误 ({0}), {1}',
        'training_failed': '训练失败: {0}',
        'unknown_error': '未知错误',
        'model_not_found': '未找到数字人模型',
        'audio_synthesis_success': '音频合成成功',
        'audio_synthesis_error': '音频合成出错: {0}\n详细错误: {1}',
        'audio_synthesis_failed': '音频合成失败: {0}',
        'select_model_prompt': '请选择数字人模型',
        'upload_audio_or_text': '请上传音频文件或输入文字',
        'task_submit_error': '提交任务出错: {0}\n详细错误: {1}',
        'task_submit_failed': '任务提交失败: {0}',
        'task_submitted': '任务已提交，任务ID: {0}',
        'query_failed': '查询失败: {0}',
        'download_failed': '视频下载失败，但任务已完成。\n音频文件可能位于: {0}\n视频结果: {1}',
        'synthesis_complete': '合成完成 (100%)',
        'download_error': '视频下载过程出错: {0}\n但任务已完成，音频文件可能位于: {1}\n视频结果: {2}',
        'no_video_url': '合成完成但没有视频URL，音频文件可能位于: {0}',
        'synthesis_progress': '正在合成中 ({0}%)',
        'task_queuing': '任务排队中',
        'task_failed': '任务失败: {0}',
        'query_error': '查询任务出错: {0}'
    },
    'en': {
        'title': 'Digital Human Training and Synthesis System',
        'paths_info': 'Storage Path Information',
        'audio_path': 'Audio files storage path',
        'video_path': 'Video files storage path',
        'api_server1': 'API Server Address 1',
        'api_server2': 'API Server Address 2',
        'train_tab': 'Digital Human Training',
        'upload_video': 'Upload Reference Video',
        'model_name': 'Digital Human Name',
        'current_status': 'Current Status',
        'ready': 'Ready',
        'start_training': 'Start Training',
        'trained_models': 'Trained Digital Humans',
        'training_result': 'Training Result',
        'synthesis_tab': 'Digital Human Synthesis',
        'select_model': 'Select Digital Human Model',
        'text_input_tab': 'Text Input',
        'input_text': 'Enter Text Content',
        'synthesize': 'Synthesize',
        'audio_upload_tab': 'Audio Upload',
        'upload_audio': 'Upload Audio File',
        'task_id': 'Task ID',
        'synthesis_status': 'Synthesis Status',
        'synthesis_result': 'Synthesis Result',
        'query_status': 'Query Synthesis Status',
        'refresh_models': 'Refresh Digital Human Model List',
        'error_no_video': 'Error: Please upload a video file',
        'error_no_name': 'Error: Please enter a name for the digital human',
        'processing_video': 'Processing video...',
        'error_no_model': 'Error: Please select a digital human model',
        'error_no_text': 'Error: Please enter text content',
        'processing_text': 'Processing text to speech...',
        'error_no_audio': 'Error: Please upload an audio file',
        'processing_audio': 'Processing audio...',
        'enter_task_id': 'Please enter a Task ID',
        'upload_video_and_name': 'Please upload a video file and enter a digital human name',
        'training_error': 'Training error: {0}\nDetailed error: {1}',
        'training_success': 'Training successful! Model ID: {0}',
        'api_response_error': 'Training failed: API response error ({0}), {1}',
        'training_failed': 'Training failed: {0}',
        'unknown_error': 'Unknown error',
        'model_not_found': 'Digital human model not found',
        'audio_synthesis_success': 'Audio synthesis successful',
        'audio_synthesis_error': 'Audio synthesis error: {0}\nDetailed error: {1}',
        'audio_synthesis_failed': 'Audio synthesis failed: {0}',
        'select_model_prompt': 'Please select a digital human model',
        'upload_audio_or_text': 'Please upload an audio file or enter text',
        'task_submit_error': 'Task submission error: {0}\nDetailed error: {1}',
        'task_submit_failed': 'Task submission failed: {0}',
        'task_submitted': 'Task submitted, Task ID: {0}',
        'query_failed': 'Query failed: {0}',
        'download_failed': 'Video download failed, but task completed.\nAudio file may be located at: {0}\nVideo result: {1}',
        'synthesis_complete': 'Synthesis complete (100%)',
        'download_error': 'Video download error: {0}\nBut task completed, audio file may be located at: {1}\nVideo result: {2}',
        'no_video_url': 'Synthesis complete but no video URL, audio file may be located at: {0}',
        'synthesis_progress': 'Synthesis in progress ({0}%)',
        'task_queuing': 'Task queuing',
        'task_failed': 'Task failed: {0}',
        'query_error': 'Query task error: {0}'
    }
}

# 使用选择的语言
lang = args.lang
t = translations[lang]

# 配置
VOICE_DATA_PATH = r"D:\heygem_data\voice\data"
FACE2FACE_TEMP_PATH = r"D:\heygem_data\face2face\temp"
MODEL_INFO_FILE = "digital_human_models.json"
API_BASE_URL = "http://localhost:18180"  # 请根据实际API地址调整
API_BASE_URL2 = "http://localhost:8383"

# 确保数据目录存在
os.makedirs(VOICE_DATA_PATH, exist_ok=True)
os.makedirs(FACE2FACE_TEMP_PATH, exist_ok=True)

# 读取已有模型信息
def load_models():
    if os.path.exists(MODEL_INFO_FILE):
        with open(MODEL_INFO_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

# 保存模型信息
def save_models(models_data):
    with open(MODEL_INFO_FILE, "w", encoding="utf-8") as f:
        json.dump(models_data, f, ensure_ascii=False, indent=2)

# 从视频中提取音频
def extract_audio_from_video(video_path):
    audio_filename = f"{uuid.uuid4()}.wav"
    audio_path = os.path.join(VOICE_DATA_PATH, audio_filename)
    
    video = AudioSegment.from_file(video_path)
    audio = video.set_channels(1).set_frame_rate(16000).set_sample_width(2)
    audio.export(audio_path, format="wav")
    
    return audio_path

# 训练数字人
def train_digital_human(video_file, name):
    # 检查输入
    if not video_file or not name:
        return None, t['upload_video_and_name']
    
    try:
        # 处理视频文件路径
        video_path = video_file
        
        # 检查video_file是对象还是字符串
        if hasattr(video_file, 'name'):
            video_path = video_file.name
        
        # 将上传的视频复制到指定路径
        video_filename = f"{uuid.uuid4()}.mp4"
        target_video_path = os.path.join(FACE2FACE_TEMP_PATH, video_filename)
        shutil.copy(video_path, target_video_path)
        
        # 提取音频用于训练
        audio_path = extract_audio_from_video(video_path)
        
        # 检查音频路径是否符合API的要求（必须在D:\heygem_data\voice\data目录下）
        if not audio_path.startswith(VOICE_DATA_PATH):
            # 确保音频文件路径正确
            audio_filename = os.path.basename(audio_path)
            correct_audio_path = os.path.join(VOICE_DATA_PATH, audio_filename)
            
            # 如果路径不正确，复制到正确位置
            if audio_path != correct_audio_path:
                shutil.copy(audio_path, correct_audio_path)
                audio_path = correct_audio_path
        
        # 获取相对路径（从VOICE_DATA_PATH开始的部分）
        audio_filename = os.path.basename(audio_path)
        relative_audio_path = audio_filename
        
        # 调用训练API
        api_data = {
            "format": "wav",
            "reference_audio": relative_audio_path,
            "lang": "zh"
        }
        
        print(f"发送API请求: {api_data}")
        print(f"原音频路径: {audio_path}")
        
        response = requests.post(
            f"{API_BASE_URL}/v1/preprocess_and_tran",
            json=api_data
        )
        
        if response.status_code != 200:
            return None, t['api_response_error'].format(response.status_code, response.text)
        
        print(f"API响应: {response.text}")
        
        result = response.json()
        
        if result.get("code") != 0:
            return None, t['training_failed'].format(result.get('msg', t['unknown_error']))
        
        # 处理可能的多个文本和音频URL（用|||分隔），只取第一个
        reference_text = result["reference_audio_text"].split("|||")[0].strip()
        reference_audio = result["asr_format_audio_url"].split("|||")[0].strip()
        
        # 创建模型信息
        model_id = str(uuid.uuid4())
        model_info = {
            "id": model_id,
            "name": name,
            "video_path": target_video_path,
            "audio_path": audio_path,
            "reference_audio": reference_audio,
            "reference_text": reference_text,
            "created_at": time.strftime("%Y-%m-%d %H:%M:%S")
        }
        
        # 保存模型信息
        models = load_models()
        if "models" not in models:
            models["models"] = []
        
        models["models"].append(model_info)
        save_models(models)
        
        # 训练成功的消息
        return True, t['training_success'].format(model_id)
        
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        return False, t['training_error'].format(str(e), error_trace)

# 获取模型详细信息
def get_model_by_name(name):
    models = load_models()
    for model in models.get("models", []):
        if model["name"] == name:
            return model
    return None

# 通过文字合成音频
def synthesize_audio(model_name, text):
    model = get_model_by_name(model_name)
    if not model:
        return None, t['model_not_found']
    
    try:
        # 处理model中的reference_audio和reference_text可能包含多个项目的情况
        reference_audio = model["reference_audio"].split("|||")[0].strip() if "|||" in model["reference_audio"] else model["reference_audio"]
        reference_text = model["reference_text"].split("|||")[0].strip() if "|||" in model["reference_text"] else model["reference_text"]
        
        # 调用语音合成API
        api_data = {
            "speaker": model["id"],
            "text": text,
            "format": "wav",
            "topP": 0.7,
            "max_new_tokens": 1024,
            "chunk_length": 100,
            "repetition_penalty": 1.2,
            "temperature": 0.7,
            "need_asr": False,
            "streaming": False,
            "is_fixed_seed": 0,
            "is_norm": 0,
            "reference_audio": reference_audio,
            "reference_text": reference_text
        }
        
        print(f"语音合成API请求: {api_data}")
        
        response = requests.post(
            f"{API_BASE_URL}/v1/invoke",
            json=api_data
        )
        
        if response.status_code != 200:
            return None, t['audio_synthesis_failed'].format(response.text)
        
        # 保存音频文件
        audio_filename = f"{uuid.uuid4()}.wav"
        # 直接保存到临时目录
        audio_path = os.path.join(FACE2FACE_TEMP_PATH, audio_filename)
        
        with open(audio_path, "wb") as f:
            f.write(response.content)
        
        # 同时在voice目录保留一份副本（可选）
        voice_audio_path = os.path.join(VOICE_DATA_PATH, audio_filename)
        shutil.copy(audio_path, voice_audio_path)
        
        return audio_path, t['audio_synthesis_success']
        
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        return None, t['audio_synthesis_error'].format(str(e), error_trace)

# 提交数字人合成任务
def submit_synthesis_job(model_name, audio_file=None, text=None):
    if not model_name:
        return None, t['select_model_prompt']
    
    if not audio_file and not text:
        return None, t['upload_audio_or_text']
    
    model = get_model_by_name(model_name)
    if not model:
        return None, t['model_not_found']
    
    try:
        # 确定音频文件路径
        audio_path = None
        
        if audio_file:
            # 使用上传的音频文件，直接存到临时目录
            audio_filename = f"{uuid.uuid4()}.wav"
            audio_path = os.path.join(FACE2FACE_TEMP_PATH, audio_filename)
            
            # 检查audio_file是对象还是字符串
            audio_file_path = audio_file
            if hasattr(audio_file, 'name'):
                audio_file_path = audio_file.name
                
            # 复制音频文件
            shutil.copy(audio_file_path, audio_path)
            
            # 同时在voice目录保留一份副本（可选）
            voice_audio_path = os.path.join(VOICE_DATA_PATH, audio_filename)
            shutil.copy(audio_path, voice_audio_path)
        elif text:
            # 通过文字合成音频（已经保存在临时目录）
            audio_path, message = synthesize_audio(model_name, text)
            if not audio_path:
                return None, message
        
        # 生成唯一任务ID
        task_id = str(uuid.uuid4())
        
        # 获取相对路径（仅文件名）
        relative_audio_path = os.path.basename(audio_path)
        relative_video_path = os.path.basename(model["video_path"])
        
        # 提交合成任务
        api_data = {
            "audio_url": relative_audio_path,
            "video_url": relative_video_path,
            "code": task_id,
            "chaofen": 0,
            "watermark_switch": 0,
            "pn": 1
        }
        
        print(f"合成任务API请求: {api_data}")
        print(f"音频路径: {audio_path}")
        print(f"视频路径: {model['video_path']}")
        
        response = requests.post(
            f"{API_BASE_URL2}/easy/submit",
            json=api_data
        )
        
        if response.status_code != 200:
            return None, t['task_submit_failed'].format(response.text)
        
        result = response.json()
        
        if not result.get("success"):
            return None, t['task_submit_failed'].format(result.get('msg'))
        
        return task_id, t['task_submitted'].format(task_id)
        
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        return None, t['task_submit_error'].format(str(e), error_trace)

# 查询合成任务状态
def query_synthesis_status(task_id):
    if not task_id:
        return t['enter_task_id'], None
    
    try:
        response = requests.get(
            f"{API_BASE_URL2}/easy/query",
            params={"code": task_id}
        )
        
        if response.status_code != 200:
            return t['query_failed'].format(response.text), None
        
        result = response.json()
        
        if not result.get("success"):
            return t['query_failed'].format(result.get('msg')), None
        
        data = result.get("data", {})
        status = data.get("status")
        progress = data.get("progress", 0)
        
        if status == 2:  # 任务完成
            video_url = data.get("result")
            if video_url:
                try:
                    # 尝试下载视频
                    video_response = requests.get(f"{API_BASE_URL2}/easy/download/{video_url.lstrip('/')}")
                    
                    if video_response.status_code != 200:
                        # 下载失败，显示音频和视频的路径信息
                        return t['download_failed'].format(FACE2FACE_TEMP_PATH, video_url), None
                    
                    # 下载成功，保存视频
                    video_filename = f"{task_id}.mp4"
                    video_path = os.path.join(FACE2FACE_TEMP_PATH, video_filename)
                    
                    with open(video_path, "wb") as f:
                        f.write(video_response.content)
                    
                    return t['synthesis_complete'], video_path
                except Exception as e:
                    # 捕获下载过程中的任何错误
                    error_msg = t['download_error'].format(str(e), FACE2FACE_TEMP_PATH, video_url)
                    print(error_msg)
                    return error_msg, None
            else:
                return t['no_video_url'].format(FACE2FACE_TEMP_PATH), None
        elif status == 1:  # 进行中
            return t['synthesis_progress'].format(progress), None
        elif status == 0:  # 排队中
            return t['task_queuing'], None
        else:  # 失败
            return t['task_failed'].format(data.get('msg')), None
            
    except Exception as e:
        return t['query_error'].format(str(e)), None

# 创建Gradio界面
with gr.Blocks(title=t['title']) as app:
    gr.Markdown(f"# {t['title']}")
    
    # 添加一些路径信息
    with gr.Accordion(t['paths_info'], open=False):
        gr.Markdown(f"""
        - {t['audio_path']}: `{VOICE_DATA_PATH}`
        - {t['video_path']}: `{FACE2FACE_TEMP_PATH}`
        - {t['api_server1']}: `{API_BASE_URL}`
        - {t['api_server2']}: `{API_BASE_URL2}`
        """)
    
    # 加载现有模型
    models = load_models()
    model_names = [model["name"] for model in models.get("models", [])]
    
    # 状态变量
    training_status = gr.State(t['ready'])
    
    with gr.Tab(t['train_tab']):
        with gr.Row():
            with gr.Column():
                train_video = gr.Video(label=t['upload_video'])
                model_name = gr.Textbox(label=t['model_name'])
                status_display = gr.Textbox(label=t['current_status'], value=t['ready'], interactive=False)
                train_btn = gr.Button(t['start_training'])
            
            with gr.Column():
                model_dropdown = gr.Dropdown(choices=model_names, label=t['trained_models'], interactive=True)
                train_output = gr.Textbox(label=t['training_result'], lines=5)
    
    with gr.Tab(t['synthesis_tab']):
        with gr.Row():
            with gr.Column():
                synth_model = gr.Dropdown(choices=model_names, label=t['select_model'], interactive=True)
                
                with gr.Tabs():
                    with gr.TabItem(t['text_input_tab']):
                        text_input = gr.Textbox(label=t['input_text'], lines=5)
                        text_submit_btn = gr.Button(t['synthesize'])
                    
                    with gr.TabItem(t['audio_upload_tab']):
                        audio_input = gr.Audio(label=t['upload_audio'], type="filepath")
                        audio_submit_btn = gr.Button(t['synthesize'])
                
                task_id_output = gr.Textbox(label=t['task_id'])
            
            with gr.Column():
                status_output = gr.Textbox(label=t['synthesis_status'], lines=3)
                video_output = gr.Video(label=t['synthesis_result'])
                query_btn = gr.Button(t['query_status'])
    
    # 添加刷新按钮
    with gr.Row():
        refresh_btn = gr.Button(t['refresh_models'])
    
    # 绑定事件
    def start_training(video_file, name):
        if not video_file:
            return t['ready'], t['error_no_video']
        if not name:
            return t['ready'], t['error_no_name']
        
        # 设置状态
        status = t['processing_video']
        
        # 执行训练
        success, message = train_digital_human(video_file, name)
        
        # 返回状态和消息
        return t['ready'], message
    
    def update_models():
        # 加载最新的模型列表
        models = load_models()
        model_names = [m["name"] for m in models.get("models", [])]
        
        # 返回更新后的下拉框内容 - 使用gr.update而不是gr.Dropdown.update
        return gr.update(choices=model_names), gr.update(choices=model_names)
    
    # 提交文字合成任务
    def submit_with_text(model, text):
        if not model:
            return None, t['error_no_model']
        if not text:
            return None, t['error_no_text']
            
        # 提交任务
        task_id, message = submit_synthesis_job(model, text=text)
        
        # 返回任务ID和消息
        return task_id, f"{t['processing_text']}\n{message}"
    
    # 提交音频合成任务
    def submit_with_audio(model, audio):
        if not model:
            return None, t['error_no_model']
        if not audio:
            return None, t['error_no_audio']
            
        # 提交任务
        task_id, message = submit_synthesis_job(model, audio_file=audio)
        
        # 返回任务ID和消息
        return task_id, f"{t['processing_audio']}\n{message}"
    
    # 修改状态查询函数，返回结果
    def query_task_status(task_id):
        if not task_id:
            return t['enter_task_id'], None
            
        status, video_path = query_synthesis_status(task_id)
        return status, video_path if video_path else None
    
    # 训练按钮点击事件
    train_btn.click(
        start_training,
        inputs=[train_video, model_name],
        outputs=[status_display, train_output]
    ).then(
        update_models,
        inputs=None,
        outputs=[model_dropdown, synth_model]
    )
    
    # 刷新按钮点击事件
    refresh_btn.click(
        update_models,
        inputs=None,
        outputs=[model_dropdown, synth_model]
    )
    
    # 提交合成任务事件
    text_submit_btn.click(
        submit_with_text,
        inputs=[synth_model, text_input],
        outputs=[task_id_output, status_output]
    )
    
    audio_submit_btn.click(
        submit_with_audio,
        inputs=[synth_model, audio_input],
        outputs=[task_id_output, status_output]
    )
    
    # 手动查询状态事件
    query_btn.click(
        query_task_status,
        inputs=[task_id_output],
        outputs=[status_output, video_output]
    )

# 启动应用
if __name__ == "__main__":
    app.launch(
        # server_name="0.0.0.0",
        # server_port=7860,
        inbrowser=True,
        # share=True
    )
