export default [
  {
    version: 1,
    script: `
                create table context
                (
                    id  INTEGER not null
                        constraint context_pk
                            primary key autoincrement,
                    key TEXT,
                    val TEXT
                );

                insert into context (key, val) values ('db_version', '1');

                create table f2f_model
                (
                    id         INTEGER
                        constraint f2f_model_pk
                            primary key autoincrement,
                    name       TEXT,
                    video_path TEXT,
                    audio_path TEXT,
                    voice_id   INTEGER,
                    created_at INTEGER
                );

                create table video
                (
                    id           INTEGER
                        constraint video_result_pk
                            primary key autoincrement,
                    file_path    TEXT,
                    status       TEXT,
                    message      TEXT,
                    model_id     INTEGER,
                    audio_path   TEXT,
                    param        INTEGER,
                    code         TEXT,
                    created_at   INTEGER,
                    progress     INTEGER default 0,
                    name         TEXT,
                    duration     INTEGER,
                    text_content TEXT
                );
                `
  },
  {
    version: 2,
    script: `create table voice
                (
                    id                   INTEGER
                        constraint tts_train_task_pk
                            primary key autoincrement,
                    origin_audio_path    TEXT,
                    lang                 TEXT,
                    asr_format_audio_url TEXT,
                    reference_audio_text TEXT,
                    created_at           INTEGER
                );
                `
  },
  {
    version: 3,
    script: `alter table video
                    add voice_id integer;
                `
  },
  {
    version: 4,
    script: ` CREATE TABLE IF NOT EXISTS coze_workflow
                (
                    id         INTEGER
                        constraint coze_workflow_pk
                            primary key autoincrement,
                    name       TEXT,
                    workflow_id TEXT,
                    app_id     TEXT,
                    coze_token TEXT,
                    desc        TEXT,
                    status     TEXT,
                    created_at INTEGER
                );
                
                `
  },
  {
    version: 5,
    script: `
                alter table coze_workflow
                    add  execute_id TEXT;
                
                CREATE TABLE IF NOT EXISTS coze_workflow_result
                (
                    id         INTEGER
                        constraint coze_workflow_pk
                            primary key autoincrement,
                    workflow_id       Text,
                    text       TEXT,
                    execute_id     TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );`
  }
]
