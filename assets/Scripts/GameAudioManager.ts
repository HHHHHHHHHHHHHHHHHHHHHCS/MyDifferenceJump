import GameData from "./GameData";
import MyStorageManager, { StorageEnum } from "./My/MyStorageManager";
import MyU from "./My/MyU";
import MySceneManager from "./My/MySceneManager";

const { ccclass, property } = cc._decorator;

export enum EffectAudioEnum {
	jumpAudio,/** 正常跳跃声音 */
	dieAudio,/** 死亡声音 */
	enemyDieAudio,/** 敌人死亡声音 */
	getItemAudio,/** 吃到物品声音 */
	spawnEnemyAudio,/** 生成敌人声音 */
	springAudio,/** 弹簧声音 */
	touchBreakAudio,/** 碎板声音,触摸和弹跳 */
	touchEnemyAudio,/** 触摸敌人的声音 */
	rocketComeAudio,/** 火箭来的声音 */
}

@ccclass
/** 声音管理器 */
export default class GameAudioManager {

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
		this.gameData = GameData.Instance;
		this.bgmSource = cc.find("World/GameAudioManager").getComponent(cc.AudioSource).getComponent(cc.AudioSource);

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

	/** 播放音效 */
	public PlayEffectAudio(effectType: EffectAudioEnum) {
		if (this.audioEffectVolume > 0) {
			cc.audioEngine.play(this.gameData.effectAudios[effectType], false, this.audioEffectVolume);
		}
	}
}