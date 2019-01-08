import Debug from "./Debug";
import { Tags } from "./GameData";

const { ccclass, property } = cc._decorator;

/** 玩家用 */
@ccclass
export default class Player extends cc.Component {
	private static instance: Player;

	public static get Instance() {
		return Player.instance;
	}

	/** 左右移动的速度 */
	@property(cc.Float)
	public horSpeed: number = 500;

	/** 跳跃的力量 */
	@property(cc.Float)
	public jumpForce: number = 1200;

	/** 重力 */
	@property(cc.Float)
	public downGravity: number = 1000;


	private xMinBorder: number;//最小的边界
	private xMaxBorder: number;//最大的边界

	private isStart: boolean;//是否开始跳跃

	private nowHorSpeed: number;//当前的水平速度
	private nowVerSpeed: number;//当前的垂直的速度
	private moveDir: number;//当前移动的方向 左:-1 中:0 右:1

	onLoad() {
		Player.instance = this;
		cc.director.getCollisionManager().enabled = true;
	}

	update(dt: number) {
		if (this.isStart) {
			this.nowVerSpeed -= this.downGravity * dt;
			let pos = this.node.position;
			pos.x += this.moveDir * this.nowHorSpeed * dt;
			pos.y += this.nowVerSpeed * dt;
			this.node.position = pos;
		}

		if (this.node.position.x < this.xMinBorder) {
			this.node.x = this.xMaxBorder
		}
		else if (this.node.position.x > this.xMaxBorder) {
			this.node.x = this.xMinBorder
		}
	}

	onCollisionEnter(other: cc.Collider, self: cc.Collider) {
		if (other.tag == Tags.Tile) {
			this.Jump();
		}
	}

	onCollisionStay(other, self) {

	}

	onCollisionExit(other, self) {

	}

	/** 设置X边界 */
	public SetXBorder(xMin: number, xMax: number): void {
		this.xMinBorder = xMin;
		this.xMaxBorder = xMax;
	}

	/** 开始跳跃 */
	public StartJump(): void {
		this.isStart = true;
		this.Jump(0);
	}

	/** 跳跃 */
	public Jump(jumpDir?: number): void {
		this.nowVerSpeed = this.jumpForce;
		if (jumpDir) {
			this.moveDir = jumpDir;
		}
		else {
			this.moveDir = Math.random() < 0.5 ? -1 : 1;
			this.node.scaleX = this.moveDir
			this.nowHorSpeed = Math.random() * this.horSpeed;
		}
	}

}
