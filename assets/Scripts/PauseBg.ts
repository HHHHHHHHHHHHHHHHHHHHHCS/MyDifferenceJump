import MyU, { SliderEvent, ClickEvent } from "./My/MyU";
import GameUIManager from "./GameUIManager";
import GameGameManager from "./GameGameManager";
import SceneManager from "./SceneManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PauseBg extends cc.Component {
	private audioEffectSlider: cc.Slider;
	private audioBgSlider: cc.Slider;
	private audioEffectPb: cc.ProgressBar;
	private audioBgPb: cc.ProgressBar;


	protected onLoad() {
		let pausePanel = cc.find("PausePanel", this.node);
		let audioEffectNode = cc.find("AudioEffectSlider", pausePanel);
		this.audioEffectSlider = audioEffectNode.getComponent(cc.Slider);
		this.audioEffectPb = audioEffectNode.getComponent(cc.ProgressBar);
		let audioBgNode = cc.find("AudioBgSlider", pausePanel);
		this.audioBgSlider = audioBgNode.getComponent(cc.Slider);
		this.audioBgPb = audioBgNode.getComponent(cc.ProgressBar);
		let resumeButton = cc.find("ResumeButton", pausePanel);
		let backMenuButton = cc.find("BackMenuButton", pausePanel);

		audioEffectNode.on(SliderEvent, this.SliderAudioEffect, this);
		audioBgNode.on(SliderEvent, this.SliderAudioBg, this);
		resumeButton.on(ClickEvent, this.ClickResume, this);
		backMenuButton.on(ClickEvent, this.ClickBackMenu, this);

	}

	protected start() {
		let audioManager = GameGameManager.Instance.audioManager;
		this.SetAudioBg(audioManager.BGMVolume);
		this.SetAudioEffect(audioManager.AudioEffectVolume);
	}

	/** 设置音效 */
	public SetAudioEffect(val: number) {
		this.audioEffectSlider.progress = val;
		this.audioEffectPb.progress = val;
		GameGameManager.Instance.audioManager.SetAudioEffect(val);
	}

	/** 音效事件 */
	private SliderAudioEffect(event: cc.Slider) {
		this.SetAudioEffect(event.progress);
	}

	/** 设置背景声音 */
	public SetAudioBg(val: number) {
		this.audioBgSlider.progress = val;
		this.audioBgPb.progress = val;
		GameGameManager.Instance.audioManager.SetBGM(val);
	}

	/** 背景声音事件 */
	private SliderAudioBg(event: cc.Slider) {
		this.SetAudioBg(event.progress);
	}

	/** 点击继续 */
	private ClickResume() {
		this.node.active = false;
		GameUIManager.Instance.ClickResume();
	}

	/** 点击返回菜单 */
	private ClickBackMenu() {
		SceneManager.LoadMenuScene();
	}
}
