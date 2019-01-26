import GameData from "./GameData";
import MyStorageManager, { StorageEnum } from "./My/MyStorageManager";
import MyU from "./My/MyU";

const { ccclass, property } = cc._decorator;


/** 菜单声音管理器 */
export default class MainAudioManager {

	private gameData: GameData;
	private bgmSource: cc.AudioSource;
	private bgmVolume: number;
	private audioEffectVolume: number;

	/** BGM音量 */
	public get BGMVolume(): number {
		return this.bgmVolume;
	}

	/** 音效声音 */
	public get AudioEffectVolume(): number {
		return this.audioEffectVolume;
	}

	public constructor() {
		this.bgmSource = cc.find("World/MenuAudioManager").getComponent(cc.AudioSource).getComponent(cc.AudioSource);

		let bgmVolume = MyStorageManager.GetFloat(StorageEnum.BGMVolume);
		let audioEffectVolume = MyStorageManager.GetFloat(StorageEnum.AudioEffectVolume);

		this.SetBGM(bgmVolume);
		this.SetAudioEffect(audioEffectVolume);

	}

	/** 设置BGM */
	public SetBGM(val: number) {
		MyStorageManager.Save(StorageEnum.BGMVolume, val);
		this.bgmVolume = val;
		this.bgmSource.volume = val;
		if (val == 0 && this.bgmSource.isPlaying) {
			this.bgmSource.stop();
		}
		else if (val > 0 && !this.bgmSource.isPlaying) {
			this.bgmSource.play();
		}
	}

	/** 设置音效 */
	public SetAudioEffect(val: number) {
		MyStorageManager.Save(StorageEnum.AudioEffectVolume, val);
		this.audioEffectVolume = val;
		if (val == 0) {
			cc.audioEngine.stopAll();
		}
	}

}