<template>
  <div class="container-content-box" v-show="modelValue">
    <div class="container">
      <img
        v-if="home.homeState.isAgree"
        src="../assets/images/common/close.svg"
        class="close"
        @click="close"
      />
      <template v-if="locale === 'zh'">
        <div class="page-title bold">授权及承诺书</div>
        <div ref="agreementRef" class="agreement" @scroll="scrollAgreement">
          <div class="text marg">
            本软件产品(包括但不限于软件程序、代码、界面设计、图像、音频、视频、文档等)的知识产权归_(以下简称“我们”)或其许可方所有。未经我们的书面许可，您不得以任何方式复制、修改、传播、出售、出租、出借、分发、反向工程、反编译或以其他方式对本软件产品进行侵权行为。
          </div>
          <div class="text marg">
            我们授予您非独家、不可转让的许可，允许您按照本软件产品的相关使用说明在您的设备上安装、使用本软件产品。但您不得超出许可范围使用本软件产品，不得将本软件产品用于商业目的或非法目的。
          </div>
          <div class="text">本人在此授权并承诺：</div>
          <div class="text">
            1、本人向数字人短视频平台（以下称“平台”）提供（包括但不限于通过线上上传、线下等方式提供）的数据（包括但不限于文字、图片、视频、音频等各种形式的内容，以及其中包含的姓名、电话号码、身份证号码、脸型、五官、身体部位、人物动作、服饰妆容、声音、文字、台词、音乐、音频、视觉设计等所有组成部分，以下统称为“数据”）的唯一权利人为本人或本人已取得全体权利人（包括但不限于著作权人等知识产权人、肖像权人、声音权人、个人信息权人、所有权人等）的合法完整授权（包括但不限于：生物识别信息编辑权、复制权、翻译权、汇编权、信息网络传播权、改编权及制作衍生品、表演和展示的权利等）（平台有权视情况要求本人提供相关授权文件）；
          </div>
          <div class="text">
            2、无论数据来源于本人还是第三方，数据所涉及的全体权利人均同意本人使用账号（即本人注册平台使用的手机号或电子邮箱）将数据用于声音制作、数字人形象制作、包含权利人肖像、声音等的视频模板制作及其它衍生作品的制作、发布。数据授权可能产生的商业价值分配纠纷或其他潜在的纠纷皆为本人与数据所涉权利人之间的问题，均由本人自行处理，与平台无关。
          </div>
          <div class="text">
            3、数据所涉及的全体权利人均已知悉并同意平台对数据的收集。数据所涉及的全体权利人均已知悉并同意平台提供的数据处理能力，包括：
          </div>
          <div class="text">
            （1） 姓名（若有）、电话号码、身份证号码（若有）、电子邮箱，用于本人账号的实名认证。
          </div>
          <div class="text">
            （2）
            训练视频以及训练视频中的脸型、五官、身体部位、人物动作、服饰妆容、声音，用于通过数字化建模、生物识别特征编辑等操作制作数字人形象、视频模板形象。
          </div>
          <div class="text">
            （3）训练音频以及训练音频中的声音，用于通过数字化建模、生物识别特征编辑等操作制作声音、制作视频模板声音。
          </div>
          <div class="text">
            4、本人保证向平台提供的数据均真实合法合规有效、不违背公序良俗且不侵犯任何人的合法权益（包括但不限于著作权等知识产权、个人隐私权、个人信息权、肖像权、声音权等）。
          </div>
          <div class="text">
            5、本人通过平台从事或拟从事的行为属于合法合规正当的行为。本人不会利用平台实施任何违反中华人民共和国法律法规政策、危害国家安全和利益、损害国家形象、侵害社会公共利益、扰乱经济和社会秩序、违反平台规则（包括但不限于：用户协议、隐私政策）、违反公序良俗或侵害他人合法权益的行为，包括但不限于：隐瞒制作的内容为深度合成的情况；利用平台制作、复制、发布、传播虚假内容、黄赌毒等违法违规内容、侵犯他人的合法权益的内容、歪曲或篡改原作者（或原人物，原权利人）思想或原作者（或原人物，原权利人）的意思表示的内容、降低原作者(或原人物，原权利人）社会评价的内容。
          </div>
          <div class="text">
            6、本人不得使用任何政治人物的肖像，也不得对素材、模板以及输出内容等中的人物肖像（如有）以冒犯、侵权、违法等任何不当方式使用，不当方式包括但不限于：（1）在色情图像或类似情形中使用；（2）用于暗示人物参与不道德或非法行为；（3）用于暗示人物遭受身体或精神衰弱、疾病等状况;（4）用于政治性代言的行为，或用于政治性言论的行为；（5）用于产品或服务代言的行为；（6）导致人物社会评价降低的行为；（7）其他可能对人物有冒犯或贬低的行为。
          </div>
          <div class="text">
            7、平台有权对本人制作(或发布）的内容进行审核，但对本人制作(或发布）的任何内容均不承担任何明示或默示的保证，均不代表平台观点或意见。平台有权根据相关证据结合《中华人民共和国民法典》、《信息网络传播权保护条例》等法律法规及本条款的规定对侵权信息或违法违规信息进行处理。
          </div>
          <div class="text">
            8、本人不得利用基于深度学习、虚拟现实等新技术新应用制作、发布、传播虚假新闻信息；本人不得利用平台功能制作、发布、传播虚假信息；本人在发布或传播利用基于深度学习、虚拟现实等新技术新应用制作的非真实音视频信息时，应当以显著方式予以标识；如本人需要发布或传播利用平台功能生成的内容时，应当以显著方式予以标识或提示；本人不应删除或者以令人误导的方式修改本平台功能已经在平台交互界面添加的标识。
          </div>
          <div class="text">
            9、本人应自行对其提供的数据、利用平台所从事的活动、通过平台进行的活动、或利用制作内容所进行的活动所引起的一切后果承担全部责任，平台的所有者、运营方及关联方对此不承担任何责任。
          </div>
          <div class="text">
            10、在任何情况下，平台、平台的所有者、运营方及关联方均不对任何间接性、后果性、惩戒性、偶然性、特殊性的损害，包括本人使用平台服务而遭受的利润损失承担责任（即使平台、平台的所有者、运营方及关联方已被告知该等损失的可能性）。
          </div>
          <div class="text">
            11、平台有权在本人制作内容的合理位置、区域进行显著标识，提示深度合成情况，本人不得采用技术手段删除、篡改、隐匿深度合成标识。
          </div>
          <div class="text">
            12、本人违反上述条款的，平台有权立即停止相关服务、删除相关数据（如：制作的结果）、终止服务或采取其他合理措施减少损失，并有权追究本人的违约责任等法律责任，也无需向本人退还支付的任何费用，并有权要求本人赔偿所有损失（包括但不限于直接损失、间接损失、商誉损害、律师费用、诉讼费、保全费、保全担保费、鉴定费、调查费、公证费和其他法律开支等一切维护权益的费用及平台因此向第三方承担的赔偿款、和解/调解费等全部费用）。
          </div>
          <div class="text">
            本人违反上述条款的，平台还有权根据司法部门或监管部门的要求，向其提供本人在平台注册的个人信息（姓名、电话号码、身份证号码等）及向平台提交/利用平台生成的全部数据。
          </div>
          <div class="text">
            13、本人系具有完全民事行为能力的年满18周岁的成年人，完全理解上述条款的含义并同意遵守上述条款。
          </div>
          <div class="text">14、禁止的行为</div>
          <div class="text">
            1）您不得对本软件产品进行任何形式的修改、改编、翻译或创建衍生作品。
          </div>
          <div class="text">
            2）您不得删除、掩盖或更改本软件产品中包含的任何版权、商标、专利或其他知识产权声明。
          </div>
          <div class="text">
            3）您不得将本软件产品与其他软件进行合并、嵌入或整合，除非获得我们的明确书面许可。
          </div>
          <div class="text">4）您不得通过任何方式绕过或破解本软件产品的技术保护措施。</div>
          <div class="text">
            5）您不得将本软件产品的许可转让给任何第三方，也不得允许任何第三方使用本软件产品。
          </div>
        </div>
        <div
          v-if="!home.homeState.isAgree"
          class="agree-btn"
          @click="onAgree"
        >
          我已阅读并同意遵守此承诺
        </div>
      </template>
      <template v-else>
        <div class="page-title bold">Authorization and Commitment Letter</div>
        <div ref="agreementRef" class="agreement" @scroll="scrollAgreement">
          <div class="text marg">
            The intellectual property rights of this software product (including but not limited to
            software programs, codes, interface designs, images, audio, video, documents, etc.)
            belong to _ (hereinafter referred to as "we") or its licensors. Without our written
            permission, you may not copy, modify, disseminate, sell, rent, lend, distribute, reverse
            engineer, decompile or otherwise infringe this software product in any way.
          </div>
          <div class="text marg">
            We grant you a non-exclusive, non-transferable license to install and use this software
            product on your device in accordance with the relevant instructions for use of this
            software product. However, you may not use this software product beyond the scope of the
            license, and you may not use this software product for commercial or illegal purposes.
          </div>
          <div class="text">I hereby authorize and commit:</div>
          <div class="text">
            1. I am the sole right holder (or I have obtained the lawful and complete authorization
            of all right holders including but not limited to copyright holders and other
            intellectual property right holders, portrait right holders, voice right holders,
            personal information right holders, property right holders, etc.) of the data (including
            but not limited to text, pictures, videos, audios and other forms of content, as well as
            all constituent parts contained therein including names, phone numbers, ID card numbers,
            facial shapes, facial features, body parts, character actions, clothing, makeup, voices,
            texts, lines, music, audios, visual designs, hereinafter collectively referred to as
            "Data") provided to the digital human short video platform (hereinafter referred to as
            the "Platform") (including but not limited to providing through online uploading,
            offline and other means) by me. (The Platform has the right to require me to provide
            relevant authorization documents as appropriate);
          </div>
          <div class="text">
            2. Regardless of whether the data originates from me or a third party, all right holders
            involved in the data agree that I use my account (i.e. the mobile phone number or email
            address I registered to use the Platform) to use the data for voice production, digital
            human image production, production and publishing of video templates containing
            portraits, voices of right holders and other derivative works. Any disputes over
            distribution of potential commercial value generated from the data authorization or
            other potential disputes are issues between me and the right holders involved in the
            data, which I will handle by myself and are irrelevant to the Platform.
          </div>
          <div class="text">
            3. All right holders involved in the data have been informed of and agreed to the
            Platform's collection of the data. All right holders involved in the data have been
            informed of and agreed to the data processing capabilities provided by the Platform,
            including:
          </div>
          <div class="text">
            (1) Name (if any), phone number, ID card number (if any), email address, used for
            real-name authentication of my account.
          </div>
          <div class="text">
            (2) Training videos and facial shapes, facial features, body parts, character actions,
            clothing, makeup, voices in the training videos are used to produce digital human
            images, video template characters through operations such as digital modeling and
            editing of biometric features.
          </div>
          <div class="text">
            (3) Training audio and voices in the training audio are used to produce voices and video
            template voices through operations such as digital modeling and editing of biometric
            features.
          </div>
          <div class="text">
            4. I guarantee that the data provided to the Platform is true, legal, compliant, valid,
            does not violate public order and good morals, and does not infringe upon the legitimate
            rights and interests of any person (including but not limited to intellectual property
            rights such as copyright, personal privacy rights, personal information rights, portrait
            rights, voice rights, etc.).
          </div>
          <div class="text">
            5. The behaviors I engage or intend to engage in through the Platform are legal,
            compliant and proper behaviors. I will not use the Platform to commit any acts in
            violation of the laws, regulations and policies of the People's Republic of China,
            endangering national security and interests, damaging the image of the state, infringing
            upon social public interests, disrupting economic and social order, violating Platform
            rules (including but not limited to User Agreement, Privacy Policy), violating public
            order and good morals, or infringing upon the legitimate rights and interests of others,
            including but not limited to: concealing the fact that the content produced is deep
            synthesis; using the Platform to produce, copy, publish and disseminate false content,
            illegal and unethical content such as gambling, drugs, pornography, content that
            infringes upon the legitimate rights and interests of others, content that distorts or
            tampers with the ideology or the intent of the original author (or original character,
            original right holder), content that lowers the social reputation of the original author
            (or original character, original right holder).
          </div>
          <div class="text">
            6. I may not use any political figure's portrait, nor may I use the portraits of
            characters in materials, templates, output content, etc. (if any) in any improper ways
            that are offensive, infringing, illegal, etc. Improper ways include but are not limited
            to: (1) use in pornographic images or similar occasions; (2) imply the character is
            engaging in unethical or illegal behaviors; (3) imply the character is suffering from
            physical or mental decline, illness or other conditions; (4) use for political
            endorsements, or use for political statements; (5) use for product or service
            endorsements; (6) behaviors that lower the character's social evaluation; (7) other
            behaviors that may be offensive or derogatory to the character.
          </div>
          <div class="text">
            7. The Platform has the right to review the content I produce (or publish), but does not
            make any express or implied warranties for any content I produce (or publish), nor does
            it represent the Platform's point of view or opinion. The platform has the right to
            process infringing information or illegal and non-compliant information in accordance
            with relevant evidence and the provisions of laws and regulations such as the Civil Code
            of the People's Republic of China and the Regulations on the Protection of the Right of
            Dissemination of Information on the Internet and this clause.
          </div>
          <div class="text">
            8. I shall not produce, publish or disseminate false news information using technologies
            and applications such as deep learning and virtual reality; I shall not use the Platform
            to produce, publish or disseminate false information; When disseminating non-real audio
            and video information produced using new technologies and applications such as deep
            learning and virtual reality, I shall make prominent identifications; If I need to
            publish or disseminate content generated using the functions of this Platform, I shall
            make prominent identifications or prompts; I shall not delete or modify the
            identifications already added by the functions of this Platform on the interactive
            interface in a misleading way.
          </div>
          <div class="text">
            9. I shall bear full responsibility for all consequences caused by the data I provide,
            the activities I engage in through the Platform, the activities conducted through the
            Platform, or the activities conducted using the produced content. The owners, operators
            and affiliates of the Platform shall not bear any responsibility.
          </div>
          <div class="text">
            10. Under any circumstances, the Platform, the owners, operators and affiliates of the
            Platform shall not be liable for any indirect, consequential, punitive, incidental or
            special damages, including loss of profits suffered by me due to the use of Platform
            services (even if the Platform, owners, operators and affiliates of the Platform have
            been notified of the possibility of such loss).
          </div>
          <div class="text">
            11. The Platform has the right to make prominent identifications indicating deep
            synthesis in reasonable positions and areas of the content I produce. I shall not use
            technical means to delete, tamper with or conceal deep synthesis identifications.
          </div>
          <div class="text">
            12. If I violate the above clauses, the Platform has the right to immediately stop
            related services, delete related data (such as produced results), terminate services or
            take other reasonable measures to mitigate losses, and has the right to investigate my
            contractual and other legal liabilities, without refunding any fees I have paid, and has
            the right to require me to compensate for all losses (including but not limited to
            direct losses, indirect losses, reputation damage, attorney fees, litigation fees,
            security fees, security deposit fees, appraisal fees, investigation fees, notarization
            fees and all other expenses to safeguard rights and interests, and all expenses such as
            compensation paid by the Platform to third parties and settlement/mediation fees
            incurred by the Platform as a result).
          </div>
          <div class="text">
            If I violate the above clauses, the Platform also has the right to provide my personal
            information registered on the Platform (such as name, phone number, ID card number,
            etc.) and all data submitted to/generated by the Platform to judicial authorities or
            regulatory authorities as required.
          </div>
          <div class="text">
            13. I am an adult over 18 years old with full civil capacity, and fully understand the
            meaning of the above clauses and agree to abide by them.
          </div>
          <div class="text">14. Prohibited Conduct</div>
          <div class="text">
            1) You may not modify, adapt, translate or create derivative works of this Software
            Product in any form.
          </div>
          <div class="text">
            2) You may not remove, obscure or alter any copyright, trademark, patent or other
            intellectual property notices contained in this Software Product.
          </div>
          <div class="text">
            3) You may not merge, embed or integrate this Software Product with other software
            unless you obtain our express written permission.
          </div>
          <div class="text">
            4) You may not bypass or crack the technical protection measures of this Software
            Product by any means.
          </div>
          <div class="text">
            5) You may not transfer the license of this Software Product to any third party, nor
            allow any third party to use this Software Product.
          </div>
        </div>
        <div
          v-if="!home.homeState.isAgree"
          class="agree-btn"
          @click="onAgree"
        >
          I have read and agree
        </div>
      </template>
    </div>
  </div>
</template>
<script setup>
import { reactive, onUpdated, ref } from 'vue'
import { useHomeStore } from '@renderer/stores/home.js'
import { saveContext } from '@renderer/api/index.js'
import { agreementKey } from '@renderer/utils/const.js'
import { useI18n } from 'vue-i18n'
const { locale } = useI18n()
const home = useHomeStore()
defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})
const agreementRef = ref(null)
const emit = defineEmits(['update:modelValue', 'change'])

const onAgree = () => {
  close()
}

const close = async () => {
  try {
    const res = await saveContext(agreementKey, 'true')
    if (res) {
      home.setIsAgree(true)
      home.setAgreementVisible(false)
      emit('update:modelValue', false)
    }
  } catch (error) {
    console.log(error)
  }
}
</script>
<style lang="less" scoped>
@import '../assets/agreement.less';
</style>
