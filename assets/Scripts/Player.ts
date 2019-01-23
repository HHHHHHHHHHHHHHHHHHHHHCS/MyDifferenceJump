import GameData, { Tags } from "./GameData";
import MyU from "./My/MyU";
import MainGameManager from "./MainGameManager";
import TileBase, { TileType } from "./TileBase";
import TouchBreakChild from "./TouchBreakChild";
import ItemManager from "./ItemManager";

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

	private hardDownForce: number;//难度:掉落速度
	private hardJumpForce: number;//难度:跳跃速度
	private hardHorSpeed: number;//难度:左右速度

	private isFly: boolean;//是否在飞行状态
	private hatUsed: cc.Node;//帽子使用
	private rocketUsed: cc.Node;//火箭使用
	private flySpeed: number;//飞行的速度


	public OnInit() {
		Player.instance = this;
		this.playerDieY = GameData.Instance.halfYBorder + this.node.height / 2;
		cc.director.getCollisionManager().enabled = true;
		this.collider = this.getComponent(cc.BoxCollider);
		this.lastPlayerY = this.node.y;
		this.scoreOffset = -this.lastPlayerY;
		this.hatUsed = cc.find("Hat_Used", this.node);
		this.rocketUsed = cc.find("Rocket_Used", this.node);
		return this;
	}

	public OnUpdate(dt: number) {

		if (this.UpdateFly(dt)) {
			this.UpdateScore();
			return;
		}

		this.UpdateMove(dt);
		this.UpdateScore();

		if (this.CheckDie()) {
			return;
		}
	}

	/** 更新移动 */
	private UpdateMove(dt: number) {
		this.nowVerSpeed -= this.hardDownForce * dt;
		let pos = this.node.position;
		pos.x += this.moveDir * this.nowHorSpeed * dt;
		pos.y += this.nowVerSpeed * dt;
		this.node.position = pos;

		/*
		if (this.node.position.x < GameData.Instance.xMinBorder) {
			this.node.x = GameData.Instance.xMaxBorder;
		}
		else if (this.node.position.x > GameData.Instance.xMaxBorder) {
			this.node.x = GameData.Instance.xMinBorder;
		}
		*/
		if (this.node.position.x <= GameData.Instance.xMinBorder) {
			this.moveDir = 1;
		}
		else if (this.node.position.x >= GameData.Instance.xMaxBorder) {
			this.moveDir = -1;
		}
	}

	onCollisionEnter(other: cc.Collider, self: cc.Collider) {
		this.CollisionEvent(other, self);
	}

	private CollisionEvent(other: cc.Collider, self: cc.Collider) {
		if (this.isFly) {
			return;
		}
		
		if (other.tag == Tags.Enemy) {
			this.GameOver();
			return;
		}

		if (this.nowVerSpeed <= 0) {
			if (other.tag == Tags.Tile || other.tag == Tags.TileChild) {
				this.Jump(other);
			}
			else if (other.tag == Tags.Item) {
				MainGameManager.Instance.itemManager.GetItem(this, other);
			}
		}
	}


	/*
	onCollisionStay(other: cc.Collider, self: cc.Collider) {
		this.CollisionEvent(other, self);
	}

	onCollisionExit(other, self) {

	}
	*/

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
	public Jump(tile?: cc.Collider, jumpDir?: number, jumpForce?: number): void {
		if (tile) {
			if (tile.tag == Tags.Tile) {
				let tileCom = tile.node.parent.getComponent(TileBase);
				if (tileCom) {
					tileCom.DoJump();
					jumpForce = tileCom.GetForceScale();
					if (jumpDir == null) {
						jumpDir = tileCom.GetJumpDir();
					}
				}
			}
			else if (tile.tag == Tags.TileChild) {
				tile.node.getComponent(TouchBreakChild).DoJump();
			}
		}

		if (jumpForce == null) {
			jumpForce = 1;
		}

		if (MainGameManager.Instance.itemManager.isSpring) {
			jumpForce *= GameData.Instance.springForce;
			jumpDir = 0;
		}

		this.nowVerSpeed = this.hardJumpForce * jumpForce;

		if (jumpDir != null) {
			this.moveDir = jumpDir;
			this.nowHorSpeed = 0;
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

	/** 执行飞行 */
	public DoFly(isHat: boolean, flySpeed: number) {
		this.isFly = true;
		if (isHat) {
			this.hatUsed.active = true;
		}
		else {
			this.rocketUsed.active = true;
		}

		this.flySpeed = flySpeed;
	}

	/** 更新飞行 */
	private UpdateFly(dt: number) {
		if (this.isFly) {
			this.node.y += this.flySpeed * dt;
			return true;
		}
		return false;
	}

	/** 结束飞行 */
	public EndFly() {
		this.isFly = false;
		this.hatUsed.active = false;
		this.rocketUsed.active = false;
		this.Jump(null, 0);
	}
}
