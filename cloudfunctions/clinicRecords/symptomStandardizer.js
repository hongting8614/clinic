// cloudfunctions/clinicRecords/symptomStandardizer.js
// 症状标准化与简化 ICD-10 规则 - 精简版，仅用于门诊登记结构化

// 一、症状分类体系（欢乐谷 11 大类 + 慢病与眩晕）
const SYMPTOM_CATEGORIES = {
  TR: '外伤类症状',          // Trauma - 游玩意外、碰撞、摔倒
  EN: '环境相关症状',        // Environmental - 中暑、晒伤、蚊虫叮咬
  MS: '肌肉骨骼症状',        // Musculoskeletal - 肌肉拉伤、扭伤、过度疲劳
  GI: '消化系统症状',        // Gastrointestinal - 饮食不当、水土不服
  NS: '神经系统症状',        // Neurological - 眩晕、惊吓、头痛
  SK: '皮肤症状',            // Skin - 皮疹、瘙痒、晒伤
  GE: '全身症状',            // General - 发热、乏力
  CV: '心血管症状',          // Cardiovascular - 心慌、胸闷
  PS: '心理症状',            // Psychological - 紧张、焦虑
  GY: '妇科症状',            // Gynecological - 痛经
  MT: '代谢类症状',          // Metabolic - 低血糖
  CD: '慢性病急性发作',      // Chronic Disease - 慢病突发
  VR: '眩晕旋转类症状'       // Vertigo - 游乐设施后眩晕
};

// 二、按系统定义症状词典（完整简化版 ICD-10 症状库）

// 2.1 呼吸系统症状（RS）
const RESPIRATORY_SYMPTOMS = {
  RS001: ['咳嗽', ['咳', '咳嗽', '干咳', '咳痰'], 1],
  RS002: ['咳痰', ['有痰', '痰多', '咳痰'], 1],
  RS003: ['呼吸困难', ['气短', '喘不过气', '气促'], 2],
  RS004: ['胸痛', ['胸口痛', '胸痛', '胸部疼痛'], 2],
  RS005: ['胸闷', ['胸口闷', '胸闷', '胸部压迫感'], 1],
  RS006: ['喘息', ['喘鸣', '哮喘音', '喘息'], 2],
  RS007: ['鼻塞', ['鼻子不通', '鼻塞', '鼻堵'], 1],
  RS008: ['流涕', ['流鼻涕', '鼻涕多', '清涕', '脓涕'], 1],
  RS009: ['打喷嚏', ['打喷嚏', '喷嚏'], 1],
  RS010: ['咽痛', ['喉咙痛', '嗓子痛', '咽痛', '吞咽痛'], 1],
  RS011: ['声音嘶哑', ['声音哑', '嘶哑', '失声'], 1],
  RS012: ['咳血', ['咯血', '痰中带血'], 3],
  RS013: ['鼻出血', ['流鼻血', '鼻衄'], 2],
  RS014: ['呼吸急促', ['呼吸快', '气急'], 2],
  RS015: ['夜间咳嗽', ['晚上咳嗽', '夜间咳'], 1]
};

// 2.2 消化系统症状（GI）
const GASTROINTESTINAL_SYMPTOMS = {
  GI001: ['恶心', ['想吐', '恶心感', '反胃', '恶心'], 1],
  GI002: ['呕吐', ['吐', '呕吐', '呕'], 2],
  GI003: ['腹泻', ['拉肚子', '泻', '水样便'], 2],
  GI004: ['便秘', ['大便干结', '排便困难', '便秘'], 1],
  GI005: ['腹痛', ['肚子痛', '腹痛', '腹部疼痛'], 2],
  GI006: ['腹胀', ['肚子胀', '腹胀', '腹部胀气'], 1],
  GI007: ['胃痛', ['胃疼', '胃痛', '上腹痛'], 2],
  GI008: ['胃灼热', ['烧心', '胃烧灼感'], 1],
  GI009: ['反酸', ['反酸水', '胃酸反流'], 1],
  GI010: ['食欲不振', ['不想吃饭', '食欲差', '没胃口'], 1],
  GI011: ['吞咽困难', ['咽东西困难', '吞咽障碍'], 2],
  GI012: ['便血', ['大便带血', '血便', '黑便'], 3],
  GI013: ['黄疸', ['皮肤发黄', '眼睛黄', '黄疸'], 3],
  GI014: ['呕血', ['吐血', '呕血'], 3],
  GI015: ['里急后重', ['想拉但拉不出', '肛门坠胀'], 2],
  GI016: ['大便颜色异常', ['白陶土样便', '绿色便'], 2],
  GI017: ['肛门疼痛', ['肛门痛', '肛周疼痛'], 1],
  GI018: ['消化不良', ['消化不好', '胃胀'], 1]
};

// 2.3 神经系统症状（NS）
const NEUROLOGICAL_SYMPTOMS = {
  NS001: ['头痛', ['头疼', '头部疼痛'], 1],
  NS002: ['头晕', ['头昏', '眩晕', '晕眩'], 2],
  NS003: ['眩晕', ['天旋地转', '旋转感'], 2],
  NS004: ['失眠', ['睡不着', '失眠', '睡眠障碍'], 1],
  NS005: ['嗜睡', ['总是想睡', '白天困倦'], 1],
  NS006: ['意识模糊', ['神志不清', '迷糊'], 3],
  NS007: ['记忆力减退', ['记性差', '健忘'], 1],
  NS008: ['抽搐', ['抽筋', '痉挛', '癫痫发作'], 3],
  NS009: ['肢体麻木', ['手脚麻木', '麻木感'], 2],
  NS010: ['肢体无力', ['手脚没力气', '乏力'], 2],
  NS011: ['言语障碍', ['说话不清', '言语困难'], 2],
  NS012: ['视力模糊', ['看不清', '视物模糊'], 2],
  NS013: ['耳鸣', ['耳朵响', '耳鸣'], 1],
  NS014: ['听力下降', ['听不清', '耳背'], 2],
  NS015: ['面瘫', ['口眼歪斜', '面部麻痹'], 3],
  NS016: ['平衡障碍', ['站不稳', '走路摇晃'], 2]
};

// 2.4 心血管系统症状（CV）
const CARDIOVASCULAR_SYMPTOMS = {
  CV001: ['心悸', ['心慌', '心跳快', '心悸'], 2],
  CV002: ['胸痛', ['心前区痛', '胸部压榨痛'], 3],
  CV003: ['胸闷', ['胸口闷', '胸部压迫感'], 2],
  CV004: ['气短', ['活动后气促', '呼吸困难'], 2],
  CV005: ['水肿', ['浮肿', '肿胀', '水肿'], 2],
  CV006: ['晕厥', ['晕倒', '昏迷', '意识丧失'], 3],
  CV007: ['脉搏不规则', ['心律不齐', '心跳不规律'], 2],
  CV008: ['高血压症状', ['头痛头晕', '心悸'], 2],
  CV009: ['低血压症状', ['头晕乏力', '眼前发黑'], 2]
};

// 2.5 肌肉骨骼症状（MS）
const MUSCULOSKELETAL_SYMPTOMS = {
  MS001: ['关节痛', ['关节疼痛', '关节炎'], 1],
  MS002: ['背痛', ['腰痛', '背部疼痛'], 1],
  MS003: ['颈痛', ['脖子痛', '颈椎痛'], 1],
  MS004: ['肌肉痛', ['肌肉酸痛', '肌痛'], 1],
  MS005: ['肢体疼痛', ['胳膊痛', '腿痛'], 1],
  MS006: ['活动受限', ['活动不便', '关节僵硬', '活动受限'], 2],
  MS007: ['关节肿胀', ['关节肿', '关节肿胀', '局部肿胀', '踝关节肿胀', '脚踝肿胀'], 2],
  MS008: ['骨折症状', ['剧痛', '畸形', '不能动'], 3],
  MS009: ['肌肉痉挛', ['抽筋', '肌肉抽搐'], 1],
  // 用于欢乐谷 TR-02 关节扭伤规则的更精细编码
  MS201: ['关节活动受限', ['活动受限', '行走困难', '走路困难', '活动时疼痛明显'], 2]
};

// 2.6 外伤/局部体表损伤症状（TR 系统补充）
// 说明：这些编码主要用于欢乐谷外伤类疾病规则（如 TR-01/02/04），
// 通过别名匹配主诉中的“扭伤踝关节、崴脚、擦伤、肿胀疼痛”等描述。
const TRAUMA_SYMPTOMS = {
  // 关节扭伤（包括踝关节、手腕、膝关节等）
  TR201: ['关节扭伤', [
    '踝关节扭伤',
    '扭伤踝关节',
    '崴脚',
    '扭伤脚踝',
    '脚踝扭伤',
    '走路时扭伤脚踝',
    '走路时扭伤踝关节',
    '跑步时崴脚',
    '跳跃时扭伤踝关节',
    '手腕扭伤',
    '扭伤手腕',
    '腕关节扭伤',
    '扭伤腕关节',
    '跑步摔倒后手腕扭伤',
    '手腕扭伤、活动受限',
    '膝关节扭伤',
    '扭伤膝关节',
    '肩关节扭伤',
    '扭伤肩关节',
    '肘关节扭伤',
    '扭伤肘关节',
    '关节扭伤',
    '扭伤'
  ], 2],
  // 局部肿胀（偏向外伤场景）
  TR301: ['局部肿胀', [
    '局部肿胀',
    '肿起来',
    '脚踝肿了',
    '踝关节肿了',
    '外伤后肿胀',
    '手腕肿胀',
    '腕关节肿胀',
    '膝关节肿胀',
    '肿胀'
  ], 2],
  // 局部疼痛/压痛（外伤疼痛）
  TR302: ['局部疼痛', [
    '局部疼痛',
    '按压痛',
    '外伤后疼痛',
    '脚踝疼痛',
    '踝关节疼痛',
    '手腕疼痛',
    '腕关节疼痛',
    '膝关节疼痛',
    '疼痛'
  ], 2]
};

// 2.7 皮肤症状（SK）
const DERMATOLOGICAL_SYMPTOMS = {
  SK001: ['皮疹', ['疹子', '红斑', '丘疹'], 1],
  SK002: ['瘙痒', ['痒', '皮肤痒'], 1],
  SK003: ['红肿', ['发红', '肿胀', '红肿'], 1],
  SK004: ['水疱', ['水泡', '疱疹'], 2],
  SK005: ['脱屑', ['脱皮', '皮屑'], 1],
  SK006: ['溃疡', ['溃烂', '伤口不愈'], 2],
  SK007: ['瘀斑', ['瘀青', '紫斑', '皮下出血'], 2],
  SK008: ['皮肤干燥', ['干燥', '脱皮'], 1],
  SK009: ['皮肤发热', ['皮温高', '发烫'], 1],
  SK010: ['指甲异常', ['指甲变形', '变色'], 1]
};

// 2.8 全身症状（GE）
const GENERAL_SYMPTOMS = {
  GE001: ['发热', ['发烧', '体温高'], 2],
  GE002: ['乏力', ['没力气', '疲劳', '疲倦'], 1],
  GE003: ['体重减轻', ['消瘦', '体重下降'], 2],
  GE004: ['体重增加', ['发胖', '体重上升'], 1],
  GE005: ['盗汗', ['夜间出汗', '睡觉出汗'], 1],
  GE006: ['寒战', ['发冷', '打寒战', '畏寒'], 1],
  GE007: ['淋巴结肿大', ['淋巴结大', '淋巴肿'], 2],
  GE008: ['全身疼痛', ['全身酸痛', '浑身痛'], 1]
};

// 2.9 泌尿生殖系统症状（GU）
const GENITOURINARY_SYMPTOMS = {
  GU001: ['尿频', ['小便次数多', '尿频'], 1],
  GU002: ['尿急', ['憋不住尿', '尿急'], 1],
  GU003: ['尿痛', ['小便痛', '排尿痛'], 2],
  GU004: ['血尿', ['小便带血', '血尿'], 3],
  GU005: ['腰痛', ['腰部疼痛', '肾区痛'], 2],
  GU006: ['月经异常', ['月经不调', '经期紊乱'], 1]
};

// 2.10 妇科/痛经相关症状（GY）——配合 GY-01/02/03 规则
const GYNECOLOGICAL_SYMPTOMS = {
  // 轻度痛经
  GY101: ['轻度痛经', [
    '轻度痛经',
    '经期',
    '来月经肚子隐痛、腰酸',
    '经期下腹隐痛',
    '经期轻度下腹疼痛',
    '经期轻微腹痛'
  ], 1],
  // 中度痛经/阵发性疼痛
  GY201: ['中度痛经', [
    '中度痛经',
    '经期',
    '经期下腹阵发性疼痛',
    '经期下腹反复绞痛',
    '经期腹痛较重'
  ], 2],
  // 重度痛经
  GY301: ['重度痛经', [
    '重度痛经',
    '经期',
    '经期腹痛剧烈',
    '经期疼痛难忍',
    '痛经严重影响活动'
  ], 3]
};

// 2.11 欢乐谷环境相关症状（EN）——中暑、晒伤、蚊虫叮咬
const ENVIRONMENTAL_SYMPTOMS = {
  EN101: ['轻度中暑', [
    '轻度中暑',
    '太阳下排队后头晕',
    '太阳下排队后头晕口渴乏力',
    '太阳下爆晒',
    '太阳下暴晒',
    '太阳下曝晒',
    '天气热感觉头晕恶心出汗多',
    '长时间暴晒后头痛乏力口渴',
    '长时间曝晒后头痛乏力口渴',
    '热天游玩后头晕心慌想吐'
  ], 2],
  EN201: ['热衰竭', [
    '热衰竭',
    '高温下活动后头晕恶心',
    '高温环境头晕呕吐全身无力',
    '暴晒后大量出汗头晕乏力'
  ], 3],
  EN202: ['热痉挛/肌肉抽筋', [
    '热痉挛',
    '高温下活动后肌肉抽筋',
    '热天跑步后小腿抽筋',
    '暴晒后肌肉痉挛'
  ], 2],
  EN103: ['日光暴晒/晒伤', [
    '晒伤',
    '晒伤后皮肤发红疼痛灼热',
    '暴晒后皮肤红肿刺痛痒',
    '晒后皮肤起红斑脱皮疼痛',
    '太阳晒后皮肤发红起泡灼痛'
  ], 2],
  EN104: ['蚊虫叮咬/过敏', [
    '蚊虫叮咬',
    '被蚊子咬后红肿瘙痒',
    '虫咬后起大包很痒',
    '蚊虫叮咬处红肿热痛',
    '虫咬后皮疹瘙痒难忍'
  ], 1]
};

// 2.12 欢乐谷扩展全身症状（GE1xx/2xx/4xx）——配合 EN/GI/MT 等规则
const GENERAL_SYMPTOMS_HV = {
  GE101: ['轻度全身不适', [
    '轻度不适',
    '头痛乏力',
    '游玩后乏力想休息'
  ], 1],
  GE102: ['明显不适/出冷汗', [
    '出冷汗',
    '面色苍白出冷汗',
    '不舒服出冷汗'
  ], 2],
  GE104: ['出汗多/疲劳', [
    '出汗多',
    '大量出汗',
    '排队久了又热又累',
    '游玩久了很疲劳'
  ], 1],
  GE201: ['发热伴消化症状', [
    '发热伴腹泻',
    '发热伴呕吐',
    '发烧肚子痛拉肚子'
  ], 2],
  GE202: ['脱水表现', [
    '脱水',
    '口干少尿',
    '全身无力站不住'
  ], 2],
  GE401: ['重度虚弱/接近休克', [
    '极度虚弱',
    '站不起来',
    '呼之不应'
  ], 4]
};

// 2.13 欢乐谷扩展消化系统症状（GI1xx/2xx）——急性胃肠炎/功能性消化不良
const GASTROINTESTINAL_SYMPTOMS_HV = {
  GI101: ['恶心/胃部不适', [
    '恶心',
    '想吐',
    '胃部不适',
    '反胃想吐'
  ], 1],
  GI102: ['饭后上腹不适', [
    '饭后胃痛',
    '吃太多后胃胀',
    '吃太多后胃胀反酸不舒服'
  ], 1],
  GI201: ['腹泻/拉肚子', [
    '腹泻',
    '拉肚子',
    '一天多次水样便',
    '呕吐腹泻',
    '吃坏肚子后腹泻'
  ], 2],
  GI202: ['急性胃肠炎表现', [
    '吃坏肚子后呕吐腹泻腹痛',
    '进食后恶心呕吐拉肚子',
    '呕吐腹泻肚子绞痛发热'
  ], 2],
  GI204: ['功能性消化不良', [
    '消化不良',
    '胃部不适食欲不振腹胀',
    '吃太多后胃胀反酸',
    '吃东西后胃疼反酸烧心'
  ], 1],
  GI206: ['胃胀/反酸', [
    '胃胀',
    '反酸',
    '反酸烧心',
    '饱胀感嗳气'
  ], 1]
};

// 2.14 欢乐谷扩展皮肤症状（SK1xx/2xx）——擦伤/晒伤/叮咬
const DERMATOLOGICAL_SYMPTOMS_HV = {
  SK102: ['瘙痒加重', [
    '很痒',
    '瘙痒难忍'
  ], 1],
  SK103: ['局部红肿', [
    '局部红肿',
    '红肿热痛'
  ], 1],
  SK104: ['擦伤/挫伤皮肤破损', [
    '擦伤',
    '蹭破皮',
    '多处擦伤',
    '皮肤擦伤疼痛'
  ], 1],
  SK201: ['晒伤红斑', [
    '晒伤起红斑',
    '皮肤发红灼热',
    '晒后皮肤红肿'
  ], 2],
  SK202: ['晒伤水疱', [
    '晒后起泡',
    '皮肤起水疱',
    '太阳晒后起泡灼痛'
  ], 2]
};

// 2.15 欢乐谷扩展神经/眩晕症状（NS1xx/2xx/3xx/4xx + VR 编码）
const NEUROLOGICAL_SYMPTOMS_HV = {
  NS101: ['头痛/头部不适', [
    '头痛',
    '玩完项目后头痛',
    '撞到头后头痛'
  ], 1],
  NS102: ['轻度头晕/不稳', [
    '头晕',
    '站不稳',
    '头昏想吐'
  ], 2],
  NS203: ['明显眩晕', [
    '天旋地转',
    '眩晕',
    '眩晕厉害',
    '旋转后眩晕呕吐',
    '旋转项目后眩晕',
    '旋转后眩晕',
    '晕动症',
    '晕动病样头晕恶心'
  ], 2],
  NS204: ['惊吓后紧张不安', [
    '受惊吓后心慌头晕出汗',
    '鬼屋出来后心慌手抖害怕',
    '惊吓后紧张不安'
  ], 1],
  NS302: ['意识模糊', [
    '意识模糊',
    '反应迟钝',
    '说话不清反应慢'
  ], 3],
  NS401: ['昏迷/抽搐', [
    '昏迷',
    '晕倒抽搐',
    '呼之不应抽搐'
  ], 4],

  // VR 前庭/位置性眩晕相关
  VRA101: ['游乐设施后眩晕', [
    '玩过山车后头晕站不稳',
    '刺激项目后头晕想吐',
    '游乐设施后头昏平衡差'
  ], 2],
  VRA102: ['旋转项目后天旋地转', [
    '坐旋转项目后头晕恶心想吐',
    '旋转项目后眩晕恶心',
    '旋转项目后眩晕、恶心',
    '旋转项目后眩晕，恶心',
    '天旋地转眩晕呕吐',
    '旋转后眩晕恶心',
    '旋转后眩晕、恶心'
  ], 2],
  VRA103: ['特定体位诱发眩晕', [
    '特定姿势时眩晕发作',
    '转头时突发眩晕几秒钟就好',
    '起床翻身时短暂天旋地转'
  ], 2],
  VRA201: ['持续前庭性眩晕', [
    '剧烈眩晕必须闭眼躺下',
    '眩晕感觉房子在转恶心'
  ], 3],
  VRA202: ['前庭相关恶心呕吐', [
    '眩晕伴呕吐',
    '旋转性眩晕伴耳鸣'
  ], 2],
  VRA203: ['位置性眩晕关键触发', [
    '头位变化时剧烈眩晕不敢动',
    '转头时眩晕明显'
  ], 3]
};

// 2.16 欢乐谷扩展心理/情绪症状（PS）
const PSYCHOLOGICAL_SYMPTOMS_HV = {
  PS101: ['紧张/焦虑', [
    '紧张不安',
    '焦虑哭闹',
    '恐怖项目后恐惧失眠噩梦'
  ], 1],
  PS202: ['过度换气', [
    '过度换气',
    '紧张后呼吸急促手脚发麻',
    '焦虑发作呼吸快头晕手麻',
    '恐慌时喘不过气手抽筋',
    '呼吸过快胸口闷嘴唇发麻'
  ], 2],
  PS203: ['儿童分离焦虑', [
    '小孩与父母走散后哭闹害怕',
    '儿童找不到家长焦虑哭闹',
    '孩子分离后恐慌不肯离开',
    '儿童焦虑紧抓不放哭泣'
  ], 1]
};

// 2.17 欢乐谷扩展代谢/低血糖症状（MT）
const METABOLIC_SYMPTOMS_HV = {
  MT101: ['低血糖先兆', [
    '心慌手抖出冷汗饥饿感',
    '头晕心慌手抖乏力',
    '游玩久了心慌出汗饿',
    '游玩久了心慌出汗',
    '游玩久了心慌、出汗、饿',
    '心慌出汗饿'
  ], 2],
  MT201: ['轻度低血糖', [
    '轻度低血糖',
    '低血糖反应心慌手抖'
  ], 2],
  MT301: ['中重度低血糖', [
    '低血糖意识模糊反应迟钝',
    '血糖低说话不清行为异常',
    '严重低血糖虚弱头晕'
  ], 3],
  MT401: ['低血糖昏迷', [
    '低血糖昏迷意识丧失',
    '血糖低到晕倒抽搐',
    '严重低血糖呼之不应'
  ], 4]
};

// 2.18 欢乐谷扩展心血管症状（CV1xx/2xx/4xx）——与低血糖/惊吓相关
const CARDIOVASCULAR_SYMPTOMS_HV = {
  CV101: ['心慌/心悸', [
    '心慌',
    '心跳很快',
    '心悸不舒服',
    '玩游乐设施后心慌出冷汗'
  ], 2],
  CV202: ['血压异常相关不适', [
    '血压低头晕',
    '血压波动心慌'
  ], 2],
  CV401: ['休克倾向', [
    '脸色苍白出冷汗',
    '脉搏微弱',
    '接近休克状态'
  ], 4]
};

// 合并所有症状字典，构建别名索引
const ALL_SYMPTOM_DICTS = [
  RESPIRATORY_SYMPTOMS,
  GASTROINTESTINAL_SYMPTOMS,
  NEUROLOGICAL_SYMPTOMS,
  CARDIOVASCULAR_SYMPTOMS,
  MUSCULOSKELETAL_SYMPTOMS,
  TRAUMA_SYMPTOMS,
  DERMATOLOGICAL_SYMPTOMS,
  GENERAL_SYMPTOMS,
  GENITOURINARY_SYMPTOMS,
  GYNECOLOGICAL_SYMPTOMS,
  ENVIRONMENTAL_SYMPTOMS,
  GENERAL_SYMPTOMS_HV,
  GASTROINTESTINAL_SYMPTOMS_HV,
  DERMATOLOGICAL_SYMPTOMS_HV,
  NEUROLOGICAL_SYMPTOMS_HV,
  PSYCHOLOGICAL_SYMPTOMS_HV,
  METABOLIC_SYMPTOMS_HV,
  CARDIOVASCULAR_SYMPTOMS_HV
];

const allSymptoms = {};
const aliasToCode = {};

(function initSymptomDB() {
  ALL_SYMPTOM_DICTS.forEach(dict => {
    Object.keys(dict).forEach(code => {
      const [name, aliases, severity] = dict[code];
      const category = code.slice(0, 2);
      allSymptoms[code] = { standardName: name, aliases, severity, category };

      const norm = s => (s || '').trim().toLowerCase();
      aliasToCode[norm(name)] = code;
      aliases.forEach(a => {
        aliasToCode[norm(a)] = code;
      });
    });
  });
})();

// 三、简化 ICD-10 疾病-症状规则（示例，可扩展）
const DISEASE_SYMPTOM_RULES = {
  'ICD10-J00': {
    name: '普通感冒',
    requiredSymptoms: ['RS007', 'RS008', 'RS009'],
    commonSymptoms: ['RS001', 'RS010', 'GE001', 'GE002'],
    optionalSymptoms: ['GE006'], // 寒战未在精简表中实现，仅作占位
    severityScore: 1,
    urgencyLevel: 'low'
  },
  'ICD10-J02': {
    name: '急性咽炎',
    requiredSymptoms: ['RS010'],
    commonSymptoms: ['RS001', 'GE001', 'GE002'],
    optionalSymptoms: [],
    severityScore: 1,
    urgencyLevel: 'low'
  }
};

// 额外：欢乐谷完整疾病-症状规则库（根据症状编码进行匹配）
const HAPPY_VALLEY_COMPLETE_DISEASE_RULES = {
  // 外伤类
  'TR-01': {
    name: '皮肤擦伤/挫伤',
    required: ['TR101', 'TR103'],
    common: ['SK104', 'TR105'],
    treatment: '清洁消毒、外用抗生素软膏',
    medications: ['碘伏', '莫匹罗星软膏', '创可贴'],
    urgent: false,
    typical_scene: '摔倒、碰撞后'
  },
  'TR-02': {
    name: '关节扭伤',
    required: ['TR201'],
    common: ['TR301', 'TR302', 'MS201', 'MS006'],
    treatment: 'RICE原则(休息冰敷加压抬高)、弹性绷带固定',
    medications: ['布洛芬', '双氯芬酸二乙胺乳胶'],
    urgent: false,
    typical_scene: '奔跑、跳跃、摔倒后关节扭伤'
  },
  'TR-03': {
    name: '头部轻微外伤',
    required: ['TR203'],
    common: ['NS101', 'TR304', 'GI101'],
    treatment: '冰敷、观察意识变化、建议CT检查',
    medications: ['对乙酰氨基酚'],
    urgent: true,
    typical_scene: '撞到游乐设施'
  },
  'TR-04': {
    name: '可疑骨折',
    required: ['TR401'],
    common: ['TR302', 'TR301', 'GE102'],
    treatment: '临时固定、立即转诊拍片',
    medications: ['布洛芬止痛'],
    urgent: true,
    typical_scene: '高处跌落、严重撞击'
  },

  // 环境类
  'EN-01': {
    name: '轻度中暑',
    required: ['EN101'],
    common: ['GE101', 'GI101', 'GE104'],
    treatment: '移至阴凉处、补充水分电解质、物理降温',
    medications: ['口服补液盐', '藿香正气水'],
    urgent: false,
    typical_scene: '长时间在烈日下排队'
  },
  'EN-02': {
    name: '热痉挛/热衰竭',
    required: ['EN201', 'EN202'],
    common: ['GE202', 'CV101', 'GI201'],
    treatment: '立即降温、静脉补液、监测生命体征',
    medications: ['静脉输液', '电解质溶液'],
    urgent: true,
    typical_scene: '高温天气剧烈活动后'
  },
  'EN-03': {
    name: '日光性皮炎',
    required: ['EN103'],
    common: ['SK201', 'SK202', 'SK103'],
    treatment: '冷敷、外用皮质类固醇、避免日晒',
    medications: ['炉甘石洗剂', '氢化可的松乳膏'],
    urgent: false,
    typical_scene: '长时间暴晒后'
  },
  'EN-04': {
    name: '蚊虫叮咬过敏',
    required: ['EN104'],
    common: ['SK201', 'SK103', 'SK102'],
    treatment: '外用抗过敏药膏、口服抗组胺药',
    medications: ['氯雷他定', '地奈德乳膏'],
    urgent: false,
    typical_scene: '园区蚊虫叮咬'
  },

  // 肌肉骨骼类
  'MS-01': {
    name: '颈部挥鞭样损伤',
    required: ['MS003', 'MS201'],  // 修改：必须包含颈痛(MS003)和活动受限(MS201)，而不是关节痛
    common: ['NS101', 'GE101', 'GI101', 'MS101'],
    treatment: '颈部固定、理疗、止痛',
    medications: ['布洛芬', '盐酸乙哌立松'],
    urgent: false,
    typical_scene: '玩过山车、大摆锤后'
  },
  'MS-02': {
    name: '急性腰痛',
    required: ['MS102'],
    common: ['MS202', 'MS301', 'GE101'],
    treatment: '卧床休息、理疗、肌肉松弛剂',
    medications: ['双氯芬酸钠', '盐酸乙哌立松'],
    urgent: false,
    typical_scene: '搬运重物、不当姿势'
  },

  // 消化类
  'GI-01': {
    name: '急性胃肠炎',
    required: ['GI202'],
    common: ['GI201', 'GE201', 'GE202'],
    treatment: '禁食4-6小时、补充电解质、对症止泻',
    medications: ['口服补液盐', '蒙脱石散', '诺氟沙星'],
    urgent: false,
    typical_scene: '食用园区食物后'
  },
  'GI-02': {
    name: '功能性消化不良',
    required: ['GI204'],
    common: ['GI102', 'GI104', 'GI206'],
    treatment: '调整饮食、促胃肠动力',
    medications: ['多潘立酮', '铝碳酸镁'],
    urgent: false,
    typical_scene: '饮食不规律、暴饮暴食'
  },

  // 神经系统类
  'NS-01': {
    name: '晕动病',
    required: ['NS203'],
    common: ['VRA102', 'GI001', 'GI101', 'NS101', 'CV101'],
    treatment: '休息、通风、抗晕动药物',
    medications: ['茶苯海明', '甲氧氯普胺'],
    urgent: false,
    typical_scene: '玩旋转类项目后'
  },
  'NS-02': {
    name: '过度惊吓反应',
    required: ['NS204'],
    common: ['PS101', 'CV101', 'GI101'],
    treatment: '心理安抚、安静环境、必要时镇静',
    medications: ['地西泮（必要时）', '谷维素'],
    urgent: false,
    typical_scene: '鬼屋、恐怖项目后'
  },

  // 情绪类
  'PS-01': {
    name: '儿童分离焦虑',
    required: ['PS203'],
    common: ['PS101', 'GI101', 'GE101'],
    treatment: '心理安抚、联系家长、分散注意力',
    medications: [],
    urgent: false,
    typical_scene: '儿童与父母走散'
  },
  'PS-02': {
    name: '过度换气综合征',
    required: ['PS202'],
    common: ['CV101', 'NS102', 'MS104'],
    treatment: '纸袋呼吸法、心理疏导',
    medications: ['地西泮（必要时）'],
    urgent: false,
    typical_scene: '过度紧张、恐慌发作'
  },

  // 眩晕旋转类
  'VR-01': {
    name: '游乐设施后眩晕',
    required: ['VRA102'],  // 修改：只需要旋转项目后眩晕即可，不需要同时有VRA101
    common: ['VRA101', 'NS203', 'GI001', 'GI101', 'NS101', 'GE101'],
    treatment: '安静休息、避免刺激、补充水分',
    medications: ['甲磺酸倍他司汀', '茶苯海明'],
    urgent: false,
    typical_scene: '刚玩完过山车、大摆锤、旋转项目等刺激项目'
  },
  'VR-02': {
    name: '前庭性眩晕',
    required: ['VRA201', 'VRA203'],
    common: ['VRA202', 'NS203', 'GI201'],
    treatment: '前庭功能康复训练、抗眩晕药物',
    medications: ['盐酸氟桂利嗪', '甲磺酸倍他司汀'],
    urgent: false,
    typical_scene: '旋转类项目后持续眩晕'
  },
  'VR-03': {
    name: '耳石症（良性阵发性位置性眩晕）',
    required: ['VRA102', 'VRA203'],
    common: ['VRA202', 'NS102', 'VRA103'],
    treatment: '耳石复位手法、前庭抑制剂',
    medications: ['甲磺酸倍他司汀'],
    urgent: false,
    typical_scene: '头位变化时短暂剧烈眩晕'
  },

  // 痛经类
  'GY-01': {
    name: '轻度痛经',
    required: ['GY101'],
    common: ['GY103', 'GE101', 'GI101'],
    treatment: '热敷腹部、休息、温和止痛',
    medications: ['布洛芬', '对乙酰氨基酚', '热水袋'],
    urgent: false,
    typical_scene: '经期游玩不适'
  },
  'GY-02': {
    name: '中度痛经',
    required: ['GY201'],
    common: ['GY202', 'GY203', 'GI201'],
    treatment: '卧床休息、有效止痛、保暖',
    medications: ['布洛芬', '双氯芬酸钠', '益母草颗粒'],
    urgent: false,
    typical_scene: '痛经影响游玩'
  },
  'GY-03': {
    name: '重度痛经',
    required: ['GY301'],
    common: ['GY303', 'GE102', 'CV101'],
    treatment: '强效止痛、休息观察、必要时转诊',
    medications: ['酮洛芬', '间苯三酚', '654-2'],
    urgent: true,
    typical_scene: '剧痛无法忍受'
  },

  // 低血糖类
  'MT-01': {
    name: '轻度低血糖',
    required: ['MT201'],
    common: ['MT101', 'GE104', 'CV101'],
    treatment: '立即补充糖分、休息监测',
    medications: ['葡萄糖片', '含糖饮料', '饼干'],
    urgent: false,
    typical_scene: '长时间游玩未进食'
  },
  'MT-02': {
    name: '中重度低血糖',
    required: ['MT301'],
    common: ['NS302', 'PS101', 'CV202'],
    treatment: '静脉推注葡萄糖、监测生命体征',
    medications: ['50%葡萄糖注射液', '监测血糖'],
    urgent: true,
    typical_scene: '糖尿病患者游玩中发作'
  },
  'MT-03': {
    name: '低血糖昏迷',
    required: ['MT401'],
    common: ['NS401', 'CV401', 'GE401'],
    treatment: '立即急救、建立静脉通道、转送医院',
    medications: ['50%葡萄糖静推', '胰高血糖素'],
    urgent: true,
    typical_scene: '严重低血糖紧急情况'
  }
};

// 四、分诊等级与工具函数

// 简化版分诊等级映射（按症状严重度 1-4 映射到红黄绿）
const TRIAGE_LEVELS = {
  RED: {
    level: 'RED',
    name: '红色警报',
    description: '立即处理，危及生命',
    color: '#ff4d4f',
    action: '立即急救，准备转诊'
  },
  YELLOW: {
    level: 'YELLOW',
    name: '黄色警报',
    description: '优先处理，较严重',
    color: '#faad14',
    action: '优先评估处理'
  },
  GREEN: {
    level: 'GREEN',
    name: '绿色通道',
    description: '常规处理，轻度症状',
    color: '#52c41a',
    action: '常规排队就诊'
  }
};

const SYMPTOM_SEVERITY_MAP = {
  1: 'GREEN',
  2: 'YELLOW',
  3: 'YELLOW',
  4: 'RED'
};

// 根据最高严重度及部分危险信号综合评估分诊等级
function assessTriage(symptomCodes, severityMax) {
  const codes = new Set(symptomCodes || []);
  const max = severityMax || 0;

  let levelKey = SYMPTOM_SEVERITY_MAP[max] || 'GREEN';

  // 危险组合升级：
  const hasTrauma = Array.from(codes).some(c => c.startsWith('TR'));
  const hasNeuro = Array.from(codes).some(c => c.startsWith('NS'));
  const hasCV = Array.from(codes).some(c => c.startsWith('CV'));

  if ((hasTrauma && hasNeuro) || (hasCV && hasNeuro)) {
    levelKey = 'RED';
  }

  const tri = TRIAGE_LEVELS[levelKey] || TRIAGE_LEVELS.GREEN;
  return tri;
}

function normalizeText(text) {
  return (text || '').trim().toLowerCase();
}

function splitPhrases(text) {
  if (!text) return [];
  // 按常见中文/英文分隔符拆分主诉
  return text
    .split(/[，,。；;、\s]+/)
    .map(s => s.trim())
    .filter(Boolean);
}

function standardizeSingle(text) {
  const norm = normalizeText(text);
  if (!norm) return null;

  // 直接别名匹配
  const directCode = aliasToCode[norm];
  if (directCode && allSymptoms[directCode]) {
    const info = allSymptoms[directCode];
    return { code: directCode, ...info };
  }

  // 改进的包含匹配：优先匹配更长的别名，提高准确性
  let best = null;
  let bestMatchLength = 0;
  
  Object.keys(allSymptoms).forEach(code => {
    const info = allSymptoms[code];
    const allAliases = [info.standardName].concat(info.aliases || []);
    for (const a of allAliases) {
      const na = normalizeText(a);
      if (na && na.length > 0) {
        // 检查主诉是否包含该别名
        if (norm.includes(na)) {
          // 优先选择更长的匹配（更精确），避免短词误匹配
          if (!best || na.length > bestMatchLength) {
            best = { code, ...info };
            bestMatchLength = na.length;
          }
        }
      }
    }
  });

  return best;
}

/**
 * 主诉文本标准化为症状编码列表
 * @param {string} complaintText 患者主诉
 * @returns {{ symptomCodes: string[], details: Array, severityMax: number, categories: Object }}
 */
function standardizeComplaint(complaintText) {
  const phrases = splitPhrases(complaintText);
  const codes = [];
  const details = [];
  const catStats = {};
  let severityMax = 0;

  phrases.forEach(p => {
    const std = standardizeSingle(p);
    if (std && !codes.includes(std.code)) {
      codes.push(std.code);
      details.push(std);
      severityMax = Math.max(severityMax, std.severity || 0);
      const cat = std.category;
      if (cat) {
        catStats[cat] = (catStats[cat] || 0) + 1;
      }
    }
  });

  return {
    symptomCodes: codes,
    details,
    severityMax,
    categories: catStats
  };
}

/**
 * 根据症状编码列表给出候选疾病
 * @param {string[]} symptomCodes
 * @returns {{ best: Object|null, candidates: Array }}
 */
function suggestDiseases(symptomCodes) {
  const set = new Set(symptomCodes || []);
  const candidates = [];

  Object.keys(DISEASE_SYMPTOM_RULES).forEach(code => {
    const rule = DISEASE_SYMPTOM_RULES[code];
    const required = rule.requiredSymptoms || [];
    // 必需症状不全则不考虑
    if (required.length && !required.every(c => set.has(c))) return;

    const commons = rule.commonSymptoms || [];
    const optionals = rule.optionalSymptoms || [];

    const commonHits = commons.filter(c => set.has(c)).length;
    const optionalHits = optionals.filter(c => set.has(c)).length;

    let score = 0;
    score += commonHits * 2;
    score += optionalHits * 1;
    score += rule.severityScore || 0;

    if (score > 0 || required.length) {
      candidates.push({
        icd10Code: code,
        name: rule.name,
        score,
        urgencyLevel: rule.urgencyLevel || 'low'
      });
    }
  });

  candidates.sort((a, b) => b.score - a.score);
  const best = candidates.length ? candidates[0] : null;

  return { best, candidates };
}

/**
 * 欢乐谷规则：根据症状编码列表匹配游乐场场景下的典型疾病/处置场景
 * @param {string[]} symptomCodes
 * @returns {{ best: Object|null, candidates: Array }}
 */
function suggestHvDiseases(symptomCodes) {
  const codesSet = new Set(symptomCodes || []);

  // ---------- 第一轮：严格匹配（必需症状全部命中） ----------
  const hardCandidates = [];

  Object.keys(HAPPY_VALLEY_COMPLETE_DISEASE_RULES).forEach(id => {
    const rule = HAPPY_VALLEY_COMPLETE_DISEASE_RULES[id];
    const required = rule.required || [];
    const common = rule.common || [];

    if (required.length && !required.every(c => codesSet.has(c))) {
      return;
    }

    const commonHits = common.filter(c => codesSet.has(c)).length;
    const totalCommon = common.length || 1;
    const matchScore = commonHits / totalCommon;

    if (matchScore < 0.34 && commonHits === 0 && required.length === 0) {
      return;
    }

    hardCandidates.push({
      id,
      name: rule.name,
      matchScore,
      urgent: !!rule.urgent,
      treatment: rule.treatment,
      medications: rule.medications || [],
      typicalScene: rule.typical_scene || ''
    });
  });

  if (hardCandidates.length) {
    hardCandidates.sort((a, b) => b.matchScore - a.matchScore);
    return { best: hardCandidates[0], candidates: hardCandidates };
  }

  // ---------- 第二轮：软匹配（必需症状不再强制全部命中） ----------
  const softCandidates = [];

  Object.keys(HAPPY_VALLEY_COMPLETE_DISEASE_RULES).forEach(id => {
    const rule = HAPPY_VALLEY_COMPLETE_DISEASE_RULES[id];
    const required = rule.required || [];
    const common = rule.common || [];

    const requiredHits = required.filter(c => codesSet.has(c)).length;
    const commonHits = common.filter(c => codesSet.has(c)).length;

    const rawScore = requiredHits * 2 + commonHits;
    if (!rawScore) return; // 没有任何命中则忽略

    const denom = (required.length * 2 + common.length) || 1;
    let matchScore = rawScore / denom;
    
    // 优化：如果必需症状命中率低于50%，降低匹配分数，避免误匹配
    if (required.length > 0) {
      const requiredRatio = requiredHits / required.length;
      if (requiredRatio < 0.5) {
        matchScore = matchScore * 0.5; // 降低50%的分数
      }
    }

    softCandidates.push({
      id,
      name: rule.name,
      matchScore,
      urgent: !!rule.urgent,
      treatment: rule.treatment,
      medications: rule.medications || [],
      typicalScene: rule.typical_scene || '',
      requiredHits,
      requiredTotal: required.length
    });
  });

  softCandidates.sort((a, b) => {
    // 优先按匹配分数排序
    if (Math.abs(b.matchScore - a.matchScore) > 0.1) {
      return b.matchScore - a.matchScore;
    }
    // 如果分数接近，优先选择必需症状命中率更高的
    const aRequiredRatio = a.requiredTotal > 0 ? a.requiredHits / a.requiredTotal : 0;
    const bRequiredRatio = b.requiredTotal > 0 ? b.requiredHits / b.requiredTotal : 0;
    return bRequiredRatio - aRequiredRatio;
  });
  
  const best = softCandidates.length ? softCandidates[0] : null;
  return { best, candidates: softCandidates };
}

module.exports = {
  SYMPTOM_CATEGORIES,
  TRIAGE_LEVELS,
  SYMPTOM_SEVERITY_MAP,
  standardizeComplaint,
  suggestDiseases,
  suggestHvDiseases,
  assessTriage
};

