// Sabai Thai — course data.
// Syllables use a phonemic spelling with a tone digit: 0 mid, 1 low, 2 falling, 3 high, 4 rising.
// Vowels: a aa i ii u uu e ee ɛ ɛɛ o oo ɔ ɔɔ ʉ ʉʉ ə əə ia ʉa ua (+ ai ao iao uai ...).
// Line format: thai | syllables | English | Burmese meaning
window.SABAI_DATA = (() => {
const CATS = [
{k:"greet", en:"Greetings & polite words", my:"နှုတ်ဆက်စကား", ic:"🙏", w:`
สวัสดี|sa1 wat1 dii0|hello|မင်္ဂလာပါ
ขอบคุณ|khɔɔp1 khun0|thank you|ကျေးဇူးတင်ပါတယ်
ขอโทษ|khɔɔ4 thoot2|sorry, excuse me|တောင်းပန်ပါတယ်
ไม่เป็นไร|mai2 pen0 rai0|never mind, it's OK|ရပါတယ်
ค่ะ|kha2|polite ending for women (statements)|ယဉ်ကျေးစကားအဆုံး (အမျိုးသမီး)
คะ|kha3|polite ending for women (questions)|မေးခွန်းအဆုံး (အမျိုးသမီး)
ครับ|khrap3|polite ending for men|ယဉ်ကျေးစကားအဆုံး (အမျိုးသား)
ใช่|chai2|yes, that's right|ဟုတ်ကဲ့
ไม่ใช่|mai2 chai2|no, that's not right|မဟုတ်ဘူး
ได้|dai2|can, OK|ရတယ်
ไม่ได้|mai2 dai2|cannot|မရဘူး
ยินดีที่ได้รู้จัก|yin0 dii0 thii2 dai2 ruu3 jak1|nice to meet you|တွေ့ရတာ ဝမ်းသာပါတယ်
สบายดีไหม|sa1 baai0 dii0 mai4|how are you?|နေကောင်းလား
สบายดี|sa1 baai0 dii0|I'm fine|နေကောင်းပါတယ်
ลาก่อน|laa0 kɔɔn1|goodbye|သွားတော့မယ်
แล้วพบกันใหม่|lɛɛw3 phop3 kan0 mai1|see you again|နောက်မှ ပြန်တွေ့မယ်
ชื่อ|chʉʉ2|name|နာမည်
เข้าใจ|khao2 jai0|understand|နားလည်တယ်
ไม่เข้าใจ|mai2 khao2 jai0|don't understand|နားမလည်ဘူး
พูดช้าๆ|phuut2 chaa3 chaa3|speak slowly|ဖြည်းဖြည်း ပြောပါ`},
{k:"people", en:"People & family", my:"လူနှင့် မိသားစု", ic:"👪", w:`
ฉัน|chan4|I (women say this)|ကျွန်မ
ผม|phom4|I (men say this)|ကျွန်တော်
คุณ|khun0|you|ခင်ဗျား / ရှင်
เขา|khao4|he, she|သူ
เรา|rao0|we|ကျွန်တော်တို့ / ငါတို့
พ่อ|phɔɔ2|father|အဖေ
แม่|mɛɛ2|mother|အမေ
พี่|phii2|older brother or sister|အစ်ကို / အစ်မ
น้อง|nɔɔng3|younger brother or sister|ညီ / ညီမ
ลูก|luuk2|son, daughter|သားသမီး
สามี|saa4 mii0|husband|ခင်ပွန်း
ภรรยา|phan0 ra3 yaa0|wife|ဇနီး
แฟน|fɛɛn0|boyfriend, girlfriend|ချစ်သူ
เพื่อน|phʉan2|friend|သူငယ်ချင်း
ครอบครัว|khrɔɔp2 khrua0|family|မိသားစု
ผู้ชาย|phuu2 chaai0|man|ယောက်ျား
ผู้หญิง|phuu2 ying4|woman|မိန်းမ
เด็ก|dek1|child|ကလေး
คน|khon0|person|လူ
ยาย|yaai0|grandmother (mother's side)|အဘွား`},
{k:"num", en:"Numbers", my:"ဂဏန်း", ic:"🔢", w:`
ศูนย์|suun4|zero|သုည
หนึ่ง|nʉng1|one|တစ်
สอง|sɔɔng4|two|နှစ်
สาม|saam4|three|သုံး
สี่|sii1|four|လေး
ห้า|haa2|five|ငါး
หก|hok1|six|ခြောက်
เจ็ด|jet1|seven|ခုနစ်
แปด|pɛɛt1|eight|ရှစ်
เก้า|kao2|nine|ကိုး
สิบ|sip1|ten|တစ်ဆယ်
ยี่สิบ|yii2 sip1|twenty|နှစ်ဆယ်
ร้อย|rɔɔy3|hundred|ရာ
พัน|phan0|thousand|ထောင်
หมื่น|mʉʉn1|ten thousand|သောင်း
แสน|sɛɛn4|hundred thousand|သိန်း
ล้าน|laan3|million|သန်း`},
{k:"time", en:"Time & days", my:"အချိန်နှင့် နေ့ရက်", ic:"⏰", w:`
วันนี้|wan0 nii3|today|ဒီနေ့
พรุ่งนี้|phrung2 nii3|tomorrow|မနက်ဖြန်
เมื่อวาน|mʉa2 waan0|yesterday|မနေ့က
ตอนเช้า|tɔɔn0 chaao3|morning|မနက်
ตอนเย็น|tɔɔn0 yen0|evening|ညနေ
กลางคืน|klaang0 khʉʉn0|night|ည
ชั่วโมง|chua2 moong0|hour|နာရီ
นาที|naa0 thii0|minute|မိနစ်
วัน|wan0|day|နေ့
สัปดาห์|sap1 daa0|week|ရက်သတ္တပတ်
เดือน|dʉan0|month|လ
ปี|pii0|year|နှစ်
ตอนนี้|tɔɔn0 nii3|now|အခု
เดี๋ยวนี้|diao4 nii3|right now|အခုချက်ချင်း
กี่โมง|kii1 moong0|what time?|ဘယ်နှနာရီလဲ
วันจันทร์|wan0 jan0|Monday|တနင်္လာနေ့
วันเสาร์|wan0 sao4|Saturday|စနေနေ့
วันอาทิตย์|wan0 aa0 thit3|Sunday|တနင်္ဂနွေနေ့
เร็ว|reo0|fast, early|မြန်တယ်
สาย|saai4|late (in the morning)|နောက်ကျတယ်`},
{k:"food", en:"Food & drink", my:"အစားအသောက်", ic:"🍜", w:`
ข้าว|khaao2|rice, meal|ထမင်း
น้ำ|naam3|water|ရေ
กิน|kin0|eat|စားတယ်
ดื่ม|dʉʉm1|drink|သောက်တယ်
อร่อย|a1 rɔɔy1|delicious|စားလို့ကောင်းတယ်
เผ็ด|phet1|spicy|စပ်တယ်
ไม่เผ็ด|mai2 phet1|not spicy|မစပ်ဘူး
หวาน|waan4|sweet|ချိုတယ်
เค็ม|khem0|salty|ငန်တယ်
เปรี้ยว|priao2|sour|ချဉ်တယ်
ไก่|kai1|chicken|ကြက်သား
หมู|muu4|pork|ဝက်သား
เนื้อ|nʉa3|beef|အမဲသား
ปลา|plaa0|fish|ငါး
กุ้ง|kung2|shrimp|ပုစွန်
ไข่|khai1|egg|ဥ
ผัก|phak1|vegetables|ဟင်းသီးဟင်းရွက်
ผลไม้|phon4 la3 maai3|fruit|သစ်သီး
กาแฟ|kaa0 fɛɛ0|coffee|ကော်ဖီ
ชา|chaa0|tea|လက်ဖက်ရည်
น้ำแข็ง|naam3 khɛng4|ice|ရေခဲ
ก๋วยเตี๋ยว|kuai4 tiao4|noodle soup|ခေါက်ဆွဲ
ส้มตำ|som2 tam0|papaya salad|သင်္ဘောသီးသုပ်
ข้าวเหนียว|khaao2 niao4|sticky rice|ကောက်ညှင်း
มะม่วง|ma3 muang2|mango|သရက်သီး
ทุเรียน|thu3 rian0|durian|ဒူးရင်းသီး
หิว|hiu4|hungry|ဗိုက်ဆာတယ်
อิ่ม|im1|full (after eating)|ဗိုက်ပြည့်ပြီ
ร้านอาหาร|raan3 aa0 haan4|restaurant|စားသောက်ဆိုင်
เช็คบิล|chek3 bin0|the bill, please|ငွေရှင်းမယ်`},
{k:"market", en:"Market & money", my:"ဈေးနှင့် ငွေ", ic:"🛍️", w:`
ราคา|raa0 khaa0|price|ဈေးနှုန်း
เท่าไหร่|thao2 rai1|how much?|ဘယ်လောက်လဲ
บาท|baat1|baht (money)|ဘတ်
เงิน|ngən0|money|ပိုက်ဆံ
แพง|phɛɛng0|expensive|ဈေးကြီးတယ်
ถูก|thuuk1|cheap|ဈေးပေါတယ်
ลดได้ไหม|lot3 dai2 mai4|can you lower the price?|ဈေးလျှော့လို့ရမလား
ซื้อ|sʉʉ3|buy|ဝယ်တယ်
ขาย|khaai4|sell|ရောင်းတယ်
ตลาด|ta1 laat1|market|ဈေး
ร้าน|raan3|shop|ဆိုင်
เอา|ao0|want, take|ယူမယ်
ไม่เอา|mai2 ao0|don't want|မယူဘူး
ถุง|thung4|plastic bag|အိတ်
เงินทอน|ngən0 thɔɔn0|change (money back)|ပြန်အမ်းငွေ
บัตร|bat1|card|ကတ်
โอนเงิน|oon0 ngən0|transfer money|ငွေလွှဲတယ်
ใหญ่|yai1|big|ကြီးတယ်
เล็ก|lek3|small|သေးတယ်
อัน|an0|piece (counting things)|ခု`},
{k:"travel", en:"Getting around", my:"သွားလာရေး", ic:"🛺", w:`
ไป|pai0|go|သွားတယ်
มา|maa0|come|လာတယ်
ซ้าย|saai3|left|ဘယ်ဘက်
ขวา|khwaa4|right|ညာဘက်
ตรงไป|trong0 pai0|go straight|တည့်တည့်သွား
เลี้ยว|liao3|turn|ကွေ့တယ်
หยุด|yut1|stop|ရပ်တယ်
ที่นี่|thii2 nii2|here|ဒီမှာ
ที่นั่น|thii2 nan2|there|ဟိုမှာ
ใกล้|klai2|near|နီးတယ်
ไกล|klai0|far|ဝေးတယ်
รถเมล์|rot3 mee0|bus|ဘတ်စ်ကား
รถไฟ|rot3 fai0|train|ရထား
แท็กซี่|thɛk3 sii2|taxi|အငှားကား
มอเตอร์ไซค์|mɔɔ0 təə0 sai0|motorbike|ဆိုင်ကယ်
เครื่องบิน|khrʉang2 bin0|airplane|လေယာဉ်
ถนน|tha1 non4|road|လမ်း
สี่แยก|sii1 yɛɛk2|crossroads|လမ်းဆုံ
ป้ายรถเมล์|paai2 rot3 mee0|bus stop|ဘတ်စ်ကားမှတ်တိုင်
ตั๋ว|tua4|ticket|လက်မှတ်`},
{k:"places", en:"Places", my:"နေရာများ", ic:"🏙️", w:`
บ้าน|baan2|house, home|အိမ်
ห้องน้ำ|hɔɔng2 naam3|toilet, bathroom|အိမ်သာ
ห้อง|hɔɔng2|room|အခန်း
โรงพยาบาล|roong0 pha3 yaa0 baan0|hospital|ဆေးရုံ
โรงเรียน|roong0 rian0|school|ကျောင်း
ร้านขายยา|raan3 khaai4 yaa0|pharmacy|ဆေးဆိုင်
ธนาคาร|tha3 naa0 khaan0|bank|ဘဏ်
วัด|wat3|temple|ဘုန်းကြီးကျောင်း
โรงแรม|roong0 rɛɛm0|hotel|ဟိုတယ်
สนามบิน|sa1 naam4 bin0|airport|လေဆိပ်
ทะเล|tha3 lee0|sea|ပင်လယ်
สถานทูต|sa1 thaan4 thuut2|embassy|သံရုံး
ตำรวจ|tam0 ruat1|police|ရဲ
ห้าง|haang2|shopping mall|ကုန်တိုက်
ประเทศ|pra1 theet2|country|နိုင်ငံ
พม่า|pha3 maa2|Myanmar|မြန်မာ
ไทย|thai0|Thai, Thailand|ထိုင်း
กรุงเทพฯ|krung0 theep2|Bangkok|ဘန်ကောက်`},
{k:"body", en:"Body & health", my:"ခန္ဓာကိုယ်နှင့် ကျန်းမာရေး", ic:"🩺", w:`
หัว|hua4|head|ခေါင်း
ตา|taa0|eye|မျက်လုံး
ปาก|paak1|mouth|ပါးစပ်
มือ|mʉʉ0|hand|လက်
ขา|khaa4|leg|ခြေထောက်
ท้อง|thɔɔng3|stomach|ဗိုက်
ฟัน|fan0|tooth|သွား
ปวด|puat1|ache|နာတယ်
ปวดหัว|puat1 hua4|headache|ခေါင်းကိုက်တယ်
ไม่สบาย|mai2 sa1 baai0|sick, unwell|နေမကောင်းဘူး
ไข้|khai2|fever|အဖျား
หมอ|mɔɔ4|doctor|ဆရာဝန်
ยา|yaa0|medicine|ဆေး
เจ็บ|jep1|it hurts|နာကျင်တယ်
ช่วยด้วย|chuai2 duai2|help!|ကယ်ပါ
แพ้|phɛɛ3|allergic|မတည့်ဘူး
เหนื่อย|nʉai1|tired|ပင်ပန်းတယ်
นอน|nɔɔn0|sleep|အိပ်တယ်`},
{k:"home", en:"Home & things", my:"အိမ်နှင့် ပစ္စည်း", ic:"🏠", w:`
ประตู|pra1 tuu0|door|တံခါး
หน้าต่าง|naa2 taang1|window|ပြတင်းပေါက်
โต๊ะ|to3|table|စားပွဲ
เก้าอี้|kao2 ii2|chair|ကုလားထိုင်
เตียง|tiang0|bed|ကုတင်
โทรศัพท์|thoo0 ra3 sap1|telephone|ဖုန်း
กุญแจ|kun0 jɛɛ0|key|သော့
เสื้อ|sʉa2|shirt, clothes|အင်္ကျီ
รองเท้า|rɔɔng0 thaao3|shoes|ဖိနပ်
กระเป๋า|kra1 pao4|bag|အိတ်
ร่ม|rom2|umbrella|ထီး
น้ำมัน|naam3 man0|oil, petrol|ဆီ
ไฟ|fai0|fire, light|မီး
แอร์|ɛɛ0|air conditioner|လေအေးပေးစက်
หนังสือ|nang4 sʉʉ4|book|စာအုပ်
ปากกา|paak1 kaa0|pen|ဘောပင်`},
{k:"work", en:"Work & documents", my:"အလုပ်နှင့် စာရွက်စာတမ်း", ic:"💼", w:`
ทำงาน|tham0 ngaan0|to work|အလုပ်လုပ်တယ်
งาน|ngaan0|work, job|အလုပ်
เงินเดือน|ngən0 dʉan0|salary|လစာ
นายจ้าง|naai0 jaang2|employer|အလုပ်ရှင်
ลูกค้า|luuk2 khaa3|customer|ဖောက်သည်
วันหยุด|wan0 yut1|day off, holiday|ပိတ်ရက်
ใบอนุญาตทำงาน|bai0 a1 nu3 yaat2 tham0 ngaan0|work permit|အလုပ်လုပ်ခွင့်လက်မှတ်
พาสปอร์ต|phaat2 sa1 pɔɔt1|passport|နိုင်ငံကူးလက်မှတ်
วีซ่า|wii0 saa2|visa|ဗီဇာ
เสร็จ|set1|finished|ပြီးပြီ
เริ่ม|rəəm2|to start|စတယ်
ช่วย|chuai2|to help|ကူညီတယ်
เรียน|rian0|to study|သင်ယူတယ်
สอน|sɔɔn4|to teach|သင်ပေးတယ်
ประชุม|pra1 chum0|meeting|အစည်းအဝေး`},
{k:"verbs", en:"Everyday verbs", my:"နေ့စဉ်သုံး ကြိယာ", ic:"🏃‍♀️", w:`
พูด|phuut2|speak|ပြောတယ်
ฟัง|fang0|listen|နားထောင်တယ်
ดู|duu0|watch, look|ကြည့်တယ်
อ่าน|aan1|read|ဖတ်တယ်
เขียน|khian4|write|ရေးတယ်
รู้|ruu3|know|သိတယ်
ชอบ|chɔɔp2|like|ကြိုက်တယ်
รัก|rak3|love|ချစ်တယ်
อยาก|yaak1|want to|ချင်တယ်
มี|mii0|have, there is|ရှိတယ်
เป็น|pen0|to be|ဖြစ်တယ်
อยู่|yuu1|to be at, to live|နေတယ်
ทำ|tham0|do, make|လုပ်တယ်
ให้|hai2|give|ပေးတယ်
รอ|rɔɔ0|wait|စောင့်တယ်
เดิน|dəən0|walk|လမ်းလျှောက်တယ်
นั่ง|nang2|sit|ထိုင်တယ်
ล้าง|laang3|wash|ဆေးတယ်
จ่าย|jaai1|pay|ပေးချေတယ်
โทร|thoo0|call (on the phone)|ဖုန်းဆက်တယ်
คิด|khit3|think|စဉ်းစားတယ်
ลืม|lʉʉm0|forget|မေ့တယ်
เปิด|pəət1|open, turn on|ဖွင့်တယ်
ปิด|pit1|close, turn off|ပိတ်တယ်
ขับรถ|khap1 rot3|drive|ကားမောင်းတယ်
อาบน้ำ|aap1 naam3|take a shower|ရေချိုးတယ်
ทำอาหาร|tham0 aa0 haan4|cook|ဟင်းချက်တယ်
ซักผ้า|sak3 phaa2|do the laundry|အဝတ်လျှော်တယ်
ใช้|chai3|use|သုံးတယ်
หา|haa4|look for|ရှာတယ်`},
{k:"adj", en:"Describing words", my:"နာမဝိသေသန", ic:"✨", w:`
ดี|dii0|good|ကောင်းတယ်
ไม่ดี|mai2 dii0|bad|မကောင်းဘူး
สวย|suai4|beautiful|လှတယ်
ร้อน|rɔɔn3|hot|ပူတယ်
หนาว|naao4|cold (weather)|ချမ်းတယ်
เย็น|yen0|cool, cold|အေးတယ်
ใหม่|mai1|new|အသစ်
เก่า|kao1|old (things)|အဟောင်း
แก่|kɛɛ1|old (people)|အသက်ကြီးတယ်
ง่าย|ngaai2|easy|လွယ်တယ်
ยาก|yaak2|difficult|ခက်တယ်
มาก|maak2|very, a lot|အရမ်း / များတယ်
น้อย|nɔɔy3|a little, few|နည်းတယ်
สะอาด|sa1 aat1|clean|သန့်ရှင်းတယ်
สกปรก|sok1 ka1 prok1|dirty|ညစ်ပတ်တယ်
ยุ่ง|yung2|busy|အလုပ်များတယ်
ว่าง|waang2|free, available|အားတယ်
สนุก|sa1 nuk1|fun|ပျော်စရာကောင်းတယ်
น่ารัก|naa2 rak3|cute, lovely|ချစ်စရာကောင်းတယ်
ใจดี|jai0 dii0|kind|စိတ်ကောင်းတယ်
จริง|jing0|true, real|တကယ်
ถูกต้อง|thuuk1 tɔɔng2|correct|မှန်တယ်
ผิด|phit1|wrong|မှားတယ်`},
{k:"grammar", en:"Question & linking words", my:"မေးခွန်းနှင့် ဆက်စပ်စကားလုံး", ic:"❓", w:`
อะไร|a1 rai0|what?|ဘာလဲ
ที่ไหน|thii2 nai4|where?|ဘယ်မှာလဲ
เมื่อไหร่|mʉa2 rai1|when?|ဘယ်တော့လဲ
ใคร|khrai0|who?|ဘယ်သူလဲ
ทำไม|tham0 mai0|why?|ဘာကြောင့်လဲ
อย่างไร|yaang1 rai0|how?|ဘယ်လိုလဲ
ไหม|mai4|yes/no question word|လား
หรือ|rʉʉ4|or|ဒါမှမဟုတ်
และ|lɛ3|and|နဲ့
แต่|tɛɛ1|but|ဒါပေမဲ့
เพราะ|phrɔ3|because|ဘာလို့လဲဆိုတော့
กับ|kap1|with|နဲ့အတူ
ของ|khɔɔng4|of, belonging to|ရဲ့
นี่|nii2|this|ဒါ
นั่น|nan2|that|အဲဒါ
ทุก|thuk3|every|တိုင်း
ไม่|mai2|not|မ ... ဘူး
แล้ว|lɛɛw3|already|ပြီ
ยัง|yang0|still, not yet|သေး
จะ|ja1|will (future)|မယ်`},
{k:"colors", en:"Colours", my:"အရောင်", ic:"🎨", w:`
สี|sii4|colour|အရောင်
แดง|dɛɛng0|red|အနီ
ขาว|khaao4|white|အဖြူ
ดำ|dam0|black|အမည်း
เขียว|khiao4|green|အစိမ်း
น้ำเงิน|naam3 ngən0|dark blue|အပြာ
เหลือง|lʉang4|yellow|အဝါ
ชมพู|chom0 phuu0|pink|ပန်းရောင်
ส้ม|som2|orange|လိမ္မော်ရောင်
ม่วง|muang2|purple|ခရမ်းရောင်`},
{k:"nature", en:"Weather, nature & animals", my:"ရာသီဥတုနှင့် သဘာဝ", ic:"🌧️", w:`
ฝน|fon4|rain|မိုး
ฝนตก|fon4 tok1|it's raining|မိုးရွာတယ်
แดด|dɛɛt1|sunshine|နေရောင်
ลม|lom0|wind|လေ
อากาศ|aa0 kaat1|weather, air|ရာသီဥတု
ฟ้า|faa3|sky|ကောင်းကင်
ภูเขา|phuu0 khao4|mountain|တောင်
แม่น้ำ|mɛɛ2 naam3|river|မြစ်
ต้นไม้|ton2 maai3|tree|သစ်ပင်
ดอกไม้|dɔɔk1 maai3|flower|ပန်း
หมา|maa4|dog|ခွေး
แมว|mɛɛw0|cat|ကြောင်
ช้าง|chaang3|elephant|ဆင်
ดวงจันทร์|duang0 jan0|moon|လ
สงกรานต์|song4 kraan0|Songkran (Thai New Year)|သင်္ကြန်`},
{k:"feel", en:"Feelings", my:"ခံစားချက်", ic:"💗", w:`
ดีใจ|dii0 jai0|glad|ဝမ်းသာတယ်
เสียใจ|sia4 jai0|sad, sorry|ဝမ်းနည်းတယ်
โกรธ|kroot1|angry|စိတ်ဆိုးတယ်
กลัว|klua0|afraid|ကြောက်တယ်
เบื่อ|bʉa1|bored|ပျင်းတယ်
คิดถึง|khit3 thʉng4|to miss someone|သတိရတယ်
มีความสุข|mii0 khwaam0 suk1|happy|ပျော်တယ်
เหงา|ngao4|lonely|အထီးကျန်တယ်
ตื่นเต้น|tʉʉn1 ten2|excited|စိတ်လှုပ်ရှားတယ်
ใจเย็น|jai0 yen0|calm, patient|စိတ်အေးအေးထား
เกรงใจ|kreeng0 jai0|not wanting to trouble others|အားနာတယ်`},
];

// Phrasebook for everyday life in Thailand, written the way a woman speaks (ค่ะ / คะ).
const PHRASES = [
{k:"meet", en:"Meeting people", my:"လူတွေ့ဆုံခြင်း", ic:"🤝", p:`
ฉันชื่อซูค่ะ|chan4 chʉʉ2 suu0 kha2|My name is Su.|ကျွန်မနာမည် ဆူ ပါ။
ฉันมาจากพม่าค่ะ|chan4 maa0 jaak1 pha3 maa2 kha2|I come from Myanmar.|ကျွန်မ မြန်မာပြည်က လာတာပါ။
ฉันพูดภาษาไทยได้นิดหน่อยค่ะ|chan4 phuut2 phaa0 saa4 thai0 dai2 nit3 nɔɔy1 kha2|I can speak a little Thai.|ကျွန်မ ထိုင်းစကား နည်းနည်း ပြောတတ်ပါတယ်။
พูดอีกครั้งได้ไหมคะ|phuut2 iik1 khrang3 dai2 mai4 kha3|Can you say that again?|ထပ်ပြောပေးလို့ ရမလား။
ขอบคุณมากค่ะ|khɔɔp1 khun0 maak2 kha2|Thank you very much.|အများကြီး ကျေးဇူးတင်ပါတယ်။
ไม่เป็นไรค่ะ|mai2 pen0 rai0 kha2|It's OK, no problem.|ရပါတယ်။`},
{k:"shop", en:"At the market", my:"ဈေးမှာ", ic:"🛒", p:`
อันนี้เท่าไหร่คะ|an0 nii3 thao2 rai1 kha3|How much is this?|ဒါ ဘယ်လောက်လဲ။
แพงไป ลดได้ไหมคะ|phɛɛng0 pai0 lot3 dai2 mai4 kha3|Too expensive. Can you lower the price?|ဈေးကြီးလွန်းတယ်။ လျှော့လို့ ရမလား။
เอาอันนี้ค่ะ|ao0 an0 nii3 kha2|I'll take this one.|ဒါ ယူမယ်။
ไม่ใส่ถุงค่ะ|mai2 sai1 thung4 kha2|No bag, thank you.|အိတ် မလိုပါဘူး။
จ่ายด้วยบัตรได้ไหมคะ|jaai1 duai2 bat1 dai2 mai4 kha3|Can I pay by card?|ကတ်နဲ့ ပေးလို့ ရမလား။`},
{k:"taxi", en:"Taxi & directions", my:"တက္ကစီနှင့် လမ်းညွှန်", ic:"🚕", p:`
ไปตลาดค่ะ|pai0 ta1 laat1 kha2|To the market, please.|ဈေးကို သွားမယ်။
เปิดมิเตอร์ด้วยค่ะ|pəət1 mi3 təə0 duai2 kha2|Please turn on the meter.|မီတာ ဖွင့်ပေးပါ။
จอดตรงนี้ค่ะ|jɔɔt1 trong0 nii3 kha2|Stop here, please.|ဒီမှာ ရပ်ပေးပါ။
ไกลไหมคะ|klai0 mai4 kha3|Is it far?|ဝေးလား။
ห้องน้ำอยู่ที่ไหนคะ|hɔɔng2 naam3 yuu1 thii2 nai4 kha3|Where is the toilet?|အိမ်သာ ဘယ်မှာလဲ။
ฉันหลงทางค่ะ|chan4 long4 thaang0 kha2|I'm lost.|ကျွန်မ လမ်းပျောက်နေတယ်။`},
{k:"eat", en:"Eating out", my:"အပြင်မှာ စားသောက်ခြင်း", ic:"🍲", p:`
ขอเมนูหน่อยค่ะ|khɔɔ4 mee0 nuu0 nɔɔy1 kha2|The menu, please.|မီနူး ပေးပါ။
ไม่เผ็ดนะคะ|mai2 phet1 na3 kha3|Not spicy, please.|မစပ်ပါစေနဲ့နော်။
ขอน้ำเปล่าหนึ่งขวดค่ะ|khɔɔ4 naam3 plao1 nʉng1 khuat1 kha2|One bottle of water, please.|ရေသန့် တစ်ဘူး ပေးပါ။
อร่อยมากค่ะ|a1 rɔɔy1 maak2 kha2|It's very delicious.|အရမ်း စားလို့ကောင်းတယ်။
เช็คบิลด้วยค่ะ|chek3 bin0 duai2 kha2|The bill, please.|ငွေရှင်းမယ်။`},
{k:"job", en:"At work", my:"အလုပ်မှာ", ic:"🧾", p:`
วันนี้ทำงานกี่โมงคะ|wan0 nii3 tham0 ngaan0 kii1 moong0 kha3|What time do we work today?|ဒီနေ့ ဘယ်နှနာရီ အလုပ်လုပ်ရမလဲ။
พรุ่งนี้ขอลาหยุดได้ไหมคะ|phrung2 nii3 khɔɔ4 laa0 yut1 dai2 mai4 kha3|Can I take tomorrow off?|မနက်ဖြန် ခွင့်ယူလို့ ရမလား။
ทำเสร็จแล้วค่ะ|tham0 set1 lɛɛw3 kha2|I've finished.|လုပ်ပြီးပါပြီ။
ช่วยสอนหน่อยได้ไหมคะ|chuai2 sɔɔn4 nɔɔy1 dai2 mai4 kha3|Could you show me how?|သင်ပေးလို့ ရမလား။`},
{k:"doctor", en:"Health & emergencies", my:"ကျန်းမာရေးနှင့် အရေးပေါ်", ic:"🚑", p:`
ฉันไม่สบายค่ะ|chan4 mai2 sa1 baai0 kha2|I'm not feeling well.|ကျွန်မ နေမကောင်းဘူး။
ปวดท้องค่ะ|puat1 thɔɔng3 kha2|I have a stomachache.|ဗိုက်နာတယ်။
ฉันแพ้ยาค่ะ|chan4 phɛɛ3 yaa0 kha2|I'm allergic to medicine.|ကျွန်မ ဆေးနဲ့ မတည့်ဘူး။
ช่วยด้วย|chuai2 duai2|Help!|ကယ်ပါ။
เรียกตำรวจ|riak2 tam0 ruat1|Call the police!|ရဲခေါ်ပေးပါ။`},
{k:"love", en:"Sweet words", my:"ချစ်စကား", ic:"💞", p:`
รักนะ|rak3 na3|Love you.|ချစ်တယ်နော်။
คิดถึงนะ|khit3 thʉng4 na3|I miss you.|သတိရတယ်နော်။
ฝันดีนะ|fan4 dii0 na3|Sweet dreams.|အိပ်မက်လှလှ မက်ပါစေ။
กินข้าวหรือยัง|kin0 khaao2 rʉʉ4 yang0|Have you eaten yet? (a caring hello)|ထမင်းစားပြီးပြီလား။`},
];

// Consonants: letter, name word, meaning EN, meaning MY, class (m/h/l), initial, final
const CONSONANTS = `
ก|ไก่|chicken|ကြက်|m|k|k
ข|ไข่|egg|ဥ|h|kh|k
ค|ควาย|buffalo|ကျွဲ|l|kh|k
ฆ|ระฆัง|bell|ခေါင်းလောင်း|l|kh|k
ง|งู|snake|မြွေ|l|ng|ng
จ|จาน|plate|ပန်းကန်|m|j|t
ฉ|ฉิ่ง|small cymbals|လင်းကွင်း|h|ch|
ช|ช้าง|elephant|ဆင်|l|ch|t
ซ|โซ่|chain|သံကြိုး|l|s|t
ฌ|เฌอ|tree|သစ်ပင်|l|ch|
ญ|หญิง|woman|မိန်းမ|l|y|n
ฎ|ชฎา|headdress|သရဖူ|m|d|t
ฏ|ปฏัก|goad|ချွန်း|m|t|t
ฐ|ฐาน|pedestal|ခုံ|h|th|t
ฑ|มณโฑ|Montho (from the Ramakien)|မန်ဒို|l|th|t
ฒ|ผู้เฒ่า|old man|အဘိုးအို|l|th|t
ณ|เณร|novice monk|ကိုရင်|l|n|n
ด|เด็ก|child|ကလေး|m|d|t
ต|เต่า|turtle|လိပ်|m|t|t
ถ|ถุง|bag|အိတ်|h|th|t
ท|ทหาร|soldier|စစ်သား|l|th|t
ธ|ธง|flag|အလံ|l|th|t
น|หนู|mouse|ကြွက်|l|n|n
บ|ใบไม้|leaf|သစ်ရွက်|m|b|p
ป|ปลา|fish|ငါး|m|p|p
ผ|ผึ้ง|bee|ပျား|h|ph|
ฝ|ฝา|lid|အဖုံး|h|f|
พ|พาน|offering tray|ကလပ်|l|ph|p
ฟ|ฟัน|tooth|သွား|l|f|p
ภ|สำเภา|junk boat|ရွက်လှေ|l|ph|p
ม|ม้า|horse|မြင်း|l|m|m
ย|ยักษ์|giant|ဘီလူး|l|y|y
ร|เรือ|boat|လှေ|l|r|n
ล|ลิง|monkey|မျောက်|l|l|n
ว|แหวน|ring|လက်စွပ်|l|w|w
ศ|ศาลา|pavilion|ဇရပ်|h|s|t
ษ|ฤๅษี|hermit|ရသေ့|h|s|t
ส|เสือ|tiger|ကျား|h|s|t
ห|หีบ|chest|သေတ္တာ|h|h|
ฬ|จุฬา|kite|စွန်|l|l|n
อ|อ่าง|basin|ဇလုံ|m||
ฮ|นกฮูก|owl|ဇီးကွက်|l|h|`;

// Vowel shapes on the carrier อ, with the sound in syllable spelling
const VOWELS = `
อะ|a|short a
อา|aa|long aa
อิ|i|short i
อี|ii|long ii
อึ|ʉ|short ue
อือ|ʉʉ|long ue
อุ|u|short u
อู|uu|long uu
เอะ|e|short e
เอ|ee|long ee
แอะ|ɛ|short ae
แอ|ɛɛ|long ae
โอะ|o|short o
โอ|oo|long oo
เอาะ|ɔ|short aw
ออ|ɔɔ|long aw
เออ|əə|long oe
เอีย|ia|ia
เอือ|ʉa|uea
อัว|ua|ua
ไอ|ai|ai
ใอ|ai|ai (a second spelling)
เอา|ao|ao
อำ|am|am`;

// Tone sets: the same sound with different tones
const TONE_SETS = [
  {en:"kha", items:"คา|khaa0|stuck · ข่า|khaa1|galangal · ค่า|khaa2|value · ค้า|khaa3|to trade · ขา|khaa4|leg"},
  {en:"mai", items:"ไม|mai0|(mid tone) · ใหม่|mai1|new · ไม่|mai2|not · ไม้|maai3|wood · ไหม|mai4|question word"},
  {en:"maa", items:"มา|maa0|come · ม้า|maa3|horse · หมา|maa4|dog"},
  {en:"paa", items:"ปา|paa0|to throw · ป่า|paa1|forest · ป้า|paa2|aunt"},
  {en:"khao", items:"ข้าว|khaao2|rice · ขาว|khaao4|white · เข่า|khao1|knee · เขา|khao4|he, she"},
  {en:"suea", items:"เสือ|sʉa4|tiger · เสื่อ|sʉa1|mat · เสื้อ|sʉa2|shirt"},
  {en:"klai", items:"ไกล|klai0|far · ใกล้|klai2|near"},
  {en:"suai", items:"ซวย|suai0|unlucky · สวย|suai4|beautiful"},
];

const parseLines = (s, keys) => s.trim().split("\n").map(l => { const p = l.split("|"); const o = {}; keys.forEach((k, i) => o[k] = (p[i] || "").trim()); return o; });
const words = [];
CATS.forEach(c => { c.words = parseLines(c.w, ["th", "syl", "en", "my"]).map(w => ({ ...w, cat: c.k })); words.push(...c.words); delete c.w; });
PHRASES.forEach(g => { g.items = parseLines(g.p, ["th", "syl", "en", "my"]); delete g.p; });
const consonants = parseLines(CONSONANTS, ["ch", "word", "en", "my", "cls", "ini", "fin"]);
const vowels = parseLines(VOWELS, ["th", "syl", "en"]);
const toneSets = TONE_SETS.map(t => ({ en: t.en, items: t.items.split(" · ").map(x => { const [th, syl, en] = x.split("|"); return { th, syl, en }; }) }));
return { cats: CATS, words, phrases: PHRASES, consonants, vowels, toneSets };
})();
