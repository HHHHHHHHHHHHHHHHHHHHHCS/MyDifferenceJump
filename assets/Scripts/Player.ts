import GameData, { Tags } from "./GameData";
import MyU from "./My/MyU";
import MainGameManager from "./MainGameManager";
import TileBase, { TileType } from "./TileBase";
import TouchBreakChild from "./TouchBreakChild";

const { ccclass, property } = cc._decorator;

/** 玩家用 */
@ccclass
export default class Player extends cc.Component {
	private static instance: Player;

	public static get Instance() {
		return Player.instance;
	}

	private playerDieY: number;//玩家死亡的Y

	/** 左右移动的速度 */
	@property(cc.Float)
	public horSpeed: number = 500;

	/** 跳跃的力量 */
	@property(cc.Float)
	public jumpForce: number = 1200;

	/** 重力 */
	@property(cc.Float)
	public downGravity: number = 1000;

	private collider: cc.BoxCollider;

	private isPlaying: boolean;//是否开始跳跃

	private lastPlayerY: number;//玩家最高的Y
	private scoreOffset: number;//分数差距偏移
	private nowHorSpeed: number;//当前的水平速度
	private nowVerSpeed: number;//当前的垂直的速度
	private moveDir: number;//当前移动的方向 左:-1 中:0 右:1

	private hardDownForce: number;
	private hardJumpForce: number;
	private hardHorSpeed: number;

	onLoad() {
		Player.instance = this;
		this.playerDieY = GameData.Instance.halfYBorder + this.node.height / 2;
		cc.director.getCollisionManager().enabled = true;
		this.collider = this.getComponent(cc.BoxCollider);
		this.lastPlayerY = this.node.y;
		this.scoreOffset = -this.lastPlayerY;
	}

	update(dt: number) {
		if (!this.isPlaying) {
			return;
		}
		this.nowVerSpeed -= this.hardDownForce * dt;
		let pos = this.node.position;
		pos.x += this.moveDir * this.nowHorSpeed * dt;
		pos.y += this.nowVerSpeed * dt;
		this.node.position = pos;

		if (this.node.position.x < GameData.Instance.xMinBorder) {
			this.node.x = GameData.Instance.xMaxBorder;
		}
		else if (this.node.position.x > GameData.Instance.xMaxBorder) {
			this.node.x = GameData.Instance.xMinBorder;
		}

		this.UpdateScore();

		if (this.CheckDie()) {
			return;
		}
	}

	onCollisionEnter(other: cc.Collider, self: cc.Collider) {
		if (other.tag == Tags.Tile || other.tag == Tags.TileChild) {
			if (this.nowVerSpeed <= 0) {
				this.Jump(other);
			}
		}
	}

	onCollisionStay(other, self) {
		if (other.tag == Tags.Tile || other.tag == Tags.TileChild) {
			if (this.nowVerSpeed <= 0) {
				this.Jump(other);
			}
		}
	}

	onCollisionExit(other, self) {

	}

	/** 添加难度 */
	public AddHard(val: number) {
		this.hardDownForce = this.downGravity * val;
		this.hardJumpForce = this.jumpForce * Math.sqrt(val);
		this.hardHorSpeed = this.horSpeed * val;
	}

	/** 开始跳跃 */
	public StartJump(): void {
		this.isPlaying = true;
		this.Jump(null, 0);
	}

	/** 跳跃 */
	public Jump(tile?: cc.Collider, jumpDir?: number): void {
		var jumpForce = 1;
		if (tile) {
			if (tile.tag == Tags.Tile) {
				let tileCom = tile.node.parent.getComponent(TileBase);
				if (tileCom) {
					tileCom.DoJump();
					jumpForce = tileCom.GetForceScale();
					jumpDir = tileCom.GetJumpDir();
				}
			}
			else if (tile.tag == Tags.TileChild) {
				tile.node.getComponent(TouchBreakChild).DoJump();
			}
		}


		this.nowVerSpeed = this.hardJumpForce * jumpForce;
		
		if (jumpDir!=null) {
			this.moveDir = jumpDir;
			this.nowHorSpeed=0;
		}
		else {
			this.moveDir = MyU.RandomNumber(-1, 1);
			this.node.scaleX = this.moveDir;
			this.nowHorSpeed = MyU.Random(0, this.hardHorSpeed);
		}
	}

	/** 更新分数 */
	public UpdateScore() {
		if (this.node.y > this.lastPlayerY) {
			this.lastPlayerY = this.node.y;
			MainGameManager.Instance.UpdateNowScore(this.lastPlayerY + this.scoreOffset);
		}
	}

	/** 检测死亡 */
	public CheckDie(): boolean {
		let dieY = MainGameManager.Instance.lastRecoveryY - this.playerDieY;
		if (dieY > this.node.y) {
			this.GameOver();
			return true;
		}
		return false;
	}

	/** 游戏结束 */
	public GameOver() {
		this.collider.enabled = false;
		this.isPlaying = false;
		MainGameManager.Instance.GameOver();
	}
}
