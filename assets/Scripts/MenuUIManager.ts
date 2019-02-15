/// <reference path="../../wx.d.ts" />

export const WX = window["wx"] as wx;


import MyU, { ClickEvent, SliderEvent } from "./My/MyU";
import SceneManager from "./SceneManager";
import MenuAudioManager from "./MenuAudioManager";
import MyStorageManager, { StorageEnum } from "./My/MyStorageManager";
import GameData from "./GameData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MenuUIManager extends cc.Component {
	public audioManager: MenuAudioManager;

	private scoreBg: cc.Node;
	private normalHighScoreText: cc.Label;
	private nighmareHighScoreText: cc.Label;

	private optionBg: cc.Node;
	private audioEffectSlider: cc.Slider;
	private audioEffectPb: cc.ProgressBar;
	private audioBgSlider: cc.Slider;
	private audioBgPb: cc.ProgressBar;

	private helpBg: cc.Node;


	protected onLoad() {
		this.audioManager = new MenuAudioManager();

		let world = cc.find("World");
		let normalPlayButton = cc.find("NormalPlayButton", world);
		let nightmarePlayButton = cc.find("NightmarePlayButton", world);
		let optionButton = cc.find("OptionButton", world);
		let scoreButton = cc.find("ScoreButton", world);
		let helpButton = cc.find("HelpButton", world);
		let shareButton = cc.find("ShareButton", world);

		this.scoreBg = cc.find("ScoreBg", world);
		let scorePanel = cc.find("Panel", this.scoreBg);
		let scoreCloseButton = cc.find("CloseButton", scorePanel);
		this.normalHighScoreText = cc.find("NormalHighScoreText", scorePanel).getComponent(cc.Label);
		this.nighmareHighScoreText = cc.find("NightmareHighScoreText", scorePanel).getComponent(cc.Label);

		this.optionBg = cc.find("OptionBg", world);
		let optionPanel = cc.find("Panel", this.optionBg);
		let optionCloseButton = cc.find("CloseButton", optionPanel);
		let audioEffectNode = cc.find("AudioEffectSlider", optionPanel);
		this.audioEffectSlider = audioEffectNode.getComponent(cc.Slider);
		this.audioEffectPb = audioEffectNode.getComponent(cc.ProgressBar);
		let audioBgNode = cc.find("AudioBgSlider", optionPanel);
		this.audioBgSlider = audioBgNode.getComponent(cc.Slider);
		this.audioBgPb = audioBgNode.getComponent(cc.ProgressBar);

		this.helpBg = cc.find("HelpBg", world);
		let helpCloseButton = cc.find("Panel/CloseButton", this.helpBg);


		normalPlayButton.on(ClickEvent, (event) => { this.ClickNormalPlay(); });
		nightmarePlayButton.on(ClickEvent, (event) => { this.ClickNighmarePlay(); });

		scoreButton.on(ClickEvent, (event) => { this.ShowScoreBg(); });
		scoreCloseButton.on(ClickEvent, (event) => { this.HideScoreBg(); });
		optionButton.on(ClickEvent, (event) => { this.ShowOptionBg(); });
		optionCloseButton.on(ClickEvent, (event) => { this.HideOptionBg(); });
		helpButton.on(ClickEvent, (event) => { this.ShowHelpBg(); });
		helpCloseButton.on(ClickEvent, (event) => { this.HideHelpBg(); });
		shareButton.on(ClickEvent, (event) => { this.ClickShareButton(); });

		audioEffectNode.on(SliderEvent, this.SliderAudioEffect, this);
		audioBgNode.on(SliderEvent, this.SliderAudioBg, this);
	}

	protected start() {
		this.SetAudioBg(this.audioManager.BGMVolume);
		this.SetAudioEffect(this.audioManager.AudioEffectVolume);
	}

	private ClickNormalPlay() {
		GameData.IsNormalMode = true;
		SceneManager.LoadGameScene();
	}

	private ClickNighmarePlay() {
		GameData.IsNormalMode = false;
		SceneManager.LoadGameScene();
	}

	private ShowScoreBg() {
		this.scoreBg.active = true;
		this.normalHighScoreText.string = MyStorageManager.GetFloat(StorageEnum.NormalHighScore).toString();
		this.nighmareHighScoreText.string = MyStorageManager.GetFloat(StorageEnum.NightmareHighScore).toString();
	}

	private HideScoreBg() {
		this.scoreBg.active = false;
	}

	private ShowOptionBg() {
		this.optionBg.active = true;
	}

	private HideOptionBg() {
		this.optionBg.active = false;
	}

	private ShowHelpBg() {
		this.helpBg.active = true;
	}

	private HideHelpBg() {
		this.helpBg.active = false;
	}

	private ClickShareButton() {
		if (CC_WECHATGAME) {
			//开启右上角的分享
			WX.showShareMenu({
				withShareTicket: true
			});
			//监听右上角的分享调用 
			cc.loader.loadRes("texture/share.png", function (err, data) {
				WX.shareAppMessage(function () {
					return {
						title: '爱的跳跃转圈圈!!!',
						imageUrl: data.url,
						success() {
							console.log("转发成功!!!");
							WX.showToast({
								title: '分享成功',
							});
						}
					};
				}());
			});
		}

	}

	/** 设置音效 */
	public SetAudioEffect(val: number) {
		this.audioEffectSlider.progress = val;
		this.audioEffectPb.progress = val;
		this.audioManager.SetAudioEffect(val);
	}

	/** 音效事件 */
	private SliderAudioEffect(event: cc.Slider) {
		this.SetAudioEffect(event.progress);
	}

	/** 设置背景声音 */
	public SetAudioBg(val: number) {
		this.audioBgSlider.progress = val;
		this.audioBgPb.progress = val;
		this.audioManager.SetBGM(val);
	}

	/** 背景声音事件 */
	private SliderAudioBg(event: cc.Slider) {
		this.SetAudioBg(event.progress);
	}

}
