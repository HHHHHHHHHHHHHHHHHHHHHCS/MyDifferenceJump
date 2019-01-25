import Player from "./Player";
import TileManager from "./TileManager";
import { GameState } from "./GameData";
import MyU from "./My/MyU";
import GameUIManager from "./GameUIManager";
import BackgroundManager from "./BackgroundManager";
import GameData from "./GameData";
import ItemManager from "./ItemManager";
import { ItemType } from "./ItemBase";
import EnemyManager from "./EnemyManager";
import AudioManager from "./GameAudioManager";
import MyStorageManager, { StorageEnum } from "./My/MyStorageManager";

const { ccclass, property } = cc._decorator;

/** 主游戏场景控制 */
@ccclass
export default class GameGameManager extends cc.Component {
	public static Instance: GameGameManager;

	public lastRecoveryY: number = Number.MIN_SAFE_INTEGER;//摄像机的最高Y

	public player: Player;
	public mainUIManager: GameUIManager;
	public tileManager: TileManager;
	public itemManager: ItemManager;
	public enemyManager: EnemyManager;
	public backgroundManager: BackgroundManager;
	public audioManager: AudioManager;

	public isPlaying: boolean;//是否在玩
	public gameState: GameState;//游戏状态


	private nowScore: number = 0;//当前的分数
	private hardNumber: number = 1;//当前的难度系数

	private isReivived;//是否复活过了


	/** 难度系数 */
	public get HardNumber() {
		return this.hardNumber;
	}

	/** 当前分数 */
	public get NowScore() {
		return this.nowScore;
	}

	/** 是否复活过了 */
	public get IsReivived() {
		return this.isReivived;
	}

	/** 游戏开始的时候 */
	onLoad() {
		GameGameManager.Instance = this;
		this.player = cc.find("World/Player").getComponent(Player).OnInit();
		this.mainUIManager = cc.find("World/UIRoot").getComponent(GameUIManager);
		this.backgroundManager = cc.find("World/Backgrounds").getComponent(BackgroundManager);

		this.audioManager = new AudioManager();
		this.tileManager = new TileManager();
		this.enemyManager = new EnemyManager();
		this.itemManager = new ItemManager();

		this.tileManager.createTileEvent.push((tile) => { this.itemManager.CreateItem(tile); });
		this.tileManager.createTileEvent.push((tile) => { this.enemyManager.CreateEnemy(tile); })
		this.tileManager.recoveryTileEvent.push((tile) => { this.itemManager.RecoveryItem(tile); });
	}

	/** 第一帧开始 */
	start() {
		this.UpdateNowScore(0);
		this.gameState = GameState.Ready;
		this.AddHard(1);
		this.tileManager.OnStart();
		this.node.on(cc.Node.EventType.TOUCH_START, this.StartGame, this);
	}

	/** 每桢事件 */
	update(dt: number) {
		if (this.gameState == GameState.Playing) {
			this.player.OnUpdate(this.itemManager.isFrozen ? dt * GameData.Instance.frozenScale : dt);
			this.tileManager.OnUpdate(dt);
			this.itemManager.OnUpdate(dt);
			this.enemyManager.OnUpdate(dt);
		}
	}

	/** 游戏开始 */
	public StartGame() {
		if (this.gameState == GameState.Ready) {
			this.gameState = GameState.Playing;
			this.isPlaying = true;
			this.node.off(cc.Node.EventType.TOUCH_START, this.StartGame, this);
			Player.Instance.StartJump();
		}
	}

	/** 暂停游戏 */
	public PauseGame() {
		this.gameState = GameState.Pause;
	}

	/** 继续游戏 */
	public ResumeGame() {
		if (this.isPlaying) {
			this.gameState = GameState.Playing;
		}
		else {
			this.gameState = GameState.Ready
		}
	}


	/** 游戏结束 */
	public GameOver() {
		this.gameState = GameState.GameOver;
		this.isPlaying = false;
		let highScore = MyStorageManager.GetFloat(StorageEnum.HighScore);

		if (isNaN(highScore)) {
			highScore = 0;
		}

		if (this.nowScore > highScore) {
			MyStorageManager.Save(StorageEnum.HighScore, this.nowScore);
		}
		this.mainUIManager.ShowGameOverBg();
	}

	/** 更新分数 */
	public UpdateNowScore(val: number) {
		val = Math.ceil(val / 100);
		if (val > this.nowScore) {
			this.nowScore = val;
			this.mainUIManager.UpdateScore(val);
		}
	}

	/** 回收 */
	public Recovery(cameraY: number) {
		if (this.isPlaying) {
			if (cameraY > this.lastRecoveryY) {
				this.lastRecoveryY = cameraY;
				this.tileManager.OnRecovery(cameraY);
				this.backgroundManager.OnRecovery(cameraY);
				this.enemyManager.OnRecovery(cameraY);
			}
		}
	}


	/** 添加难度 */
	public AddHard(val?: number): void {
		if (val) {
			this.hardNumber = val;
		}
		else {
			this.hardNumber *= GameData.Instance.hardBase;
		}
		Player.Instance.AddHard(this.hardNumber);
	}


	/** 复活 */
	public DoReivive() {
		if (!this.isReivived) {
			this.isReivived = true;
			this.gameState = GameState.Playing;
			this.isPlaying = true;

			this.player.Reivive();
		}

	}
}
