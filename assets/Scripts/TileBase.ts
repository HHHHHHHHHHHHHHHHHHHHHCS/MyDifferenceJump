import GameData from "./GameData";
import MyU from "./My/MyU";
import MainGameManager from "./MainGameManager";

const { ccclass, property } = cc._decorator;

export const enum TileType {
	Normal_Hor = 0,
	Normal_Ver,
	Move_Hor,
	Touch_Break,
	Spring_Hor,
	Frozen_Hor,
}

@ccclass
export default class TileBase extends cc.Component {

	private tileType: TileType;

	private sprite: cc.Sprite;

	private updateEvent: Function;//update事件
	private startTouchEvent: Function;//开始触摸事件
	private keepTouchEvent: Function;//保持触摸事件
	private endTouchEvent: Function;//结束触摸事件
	private jumpEvent: Function;//踩踏事件

	private isCatch: boolean;//是否抓着
	private clampUp: number;//上的限制
	private clampDown: number;//下的限制
	private moveDir: number;//左右移动方向 -1 左边,1 右边
	private moveHorSpeed: number;//左右移动的速度
	private isFrozen = false;//是否冻结
	private touchCount = 0;//解冻的点击次数

	public get TileType() {
		return this.tileType;
	}

	protected onLoad() {
		this.sprite = this.node.getChildByName("TileImage").getComponent(cc.Sprite);
	}

	protected onEnable() {
		this.node.on(cc.Node.EventType.TOUCH_START, this.StartTouch, this);
		this.node.on(cc.Node.EventType.TOUCH_MOVE, this.KeepTouch, this);
		this.node.on(cc.Node.EventType.TOUCH_END, this.EndTouch, this);
		this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.EndTouch, this);
	}

	protected onDisable() {
		this.node.off(cc.Node.EventType.TOUCH_START, this.StartTouch, this);
		this.node.off(cc.Node.EventType.TOUCH_MOVE, this.KeepTouch, this);
		this.node.off(cc.Node.EventType.TOUCH_END, this.EndTouch, this);
		this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.EndTouch, this);
	}

	protected update(dt: number) {
		if (MainGameManager.Instance.isPlaying) {
			if (this.updateEvent) {
				this.updateEvent(dt);
			}
		}
	}

	/** 初始化 */
	public Init(type: TileType, pos: cc.Vec2) {
		this.node.opacity = 255;//颜色重新设置,有时候抓住,被回收了颜色是暗淡的
		this.isCatch = false;
		this.isFrozen = false;
		this.node.active = true;
		this.tileType = type;
		this.sprite.spriteFrame = GameData.Instance.tileSprites[this.tileType];
		this.node.position = pos;
		this.SetParameter();
		this.RegisterEvent();
	}

	/** 设置数据 */
	private SetParameter() {
		switch (this.tileType) {
			case TileType.Normal_Ver: {
				this.clampUp = this.node.position.y + GameData.Instance.horMoveClamp;
				this.clampDown = this.node.position.y - GameData.Instance.horMoveClamp;
				break;
			}
			case TileType.Move_Hor: {
				this.moveDir = MyU.RandomNumber(-1, 1);
				this.moveHorSpeed = GameData.Instance.horMoveSpeed * MainGameManager.Instance.HardNumber;
				break;
			}
			case TileType.Frozen_Hor: {
				this.isFrozen = true;
				this.touchCount = GameData.Instance.frozenHorTouchCount;
				break;
			}
		}
	}

	/** 注册事件 */
	private RegisterEvent() {
		switch (this.tileType) {
			case TileType.Normal_Hor: {
				this.startTouchEvent = this.Normal_Start;
				this.keepTouchEvent = this.Normal_Hor_Keep;
				this.endTouchEvent = this.Normal_Hor_End;
				break;
			}
			case TileType.Normal_Ver: {
				this.startTouchEvent = this.Normal_Start;
				this.keepTouchEvent = this.Normal_Ver_Keep;
				this.endTouchEvent = this.Normal_Hor_End;
				break;
			}
			case TileType.Move_Hor: {
				this.startTouchEvent = this.Normal_Start;
				this.keepTouchEvent = this.Normal_Hor_Keep;
				this.endTouchEvent = this.Normal_Hor_End;
				this.updateEvent = this.Move_Hor_Update;
				break;
			}
			case TileType.Touch_Break: {
				this.endTouchEvent = this.Touch_Break_End;
				this.jumpEvent = this.DropDown;
				break;
			}
			case TileType.Spring_Hor: {
				this.startTouchEvent = this.Normal_Start;
				this.keepTouchEvent = this.Normal_Hor_Keep;
				this.endTouchEvent = this.Normal_Hor_End;
				this.jumpEvent = this.DropDown;
				break;
			}
			case TileType.Frozen_Hor: {
				this.startTouchEvent = this.Normal_Start;
				this.keepTouchEvent = this.Froze_Hor_Keep;
				this.endTouchEvent = this.Froze_Hor_End;
				break;
			}
		}
	}

	/** 开始触摸 */
	private StartTouch(event: cc.Event.EventTouch) {
		if (this.startTouchEvent) {
			this.startTouchEvent();
		}
		event.stopPropagation();
	}

	/** 保持触摸 */
	private KeepTouch(event: cc.Event.EventTouch) {
		if (this.keepTouchEvent) {
			this.keepTouchEvent(event)
		}
		event.stopPropagation();
	}

	/** 结束触摸 */
	private EndTouch(event: cc.Event.EventTouch) {
		if (this.endTouchEvent) {
			this.endTouchEvent(event)
		}
		event.stopPropagation();
	}


	/** 跳板被跳跃 */
	public DoJump() {
		if (this.jumpEvent) {
			this.jumpEvent();
		}
	}

	/** 回收注销事件 */
	public Recovery() {
		this.node.stopAllActions();
		this.RecoveryNoAction();
	}

	/** 回收,但是不停止运动 */
	public RecoveryNoAction() {
		this.updateEvent = null;
		this.startTouchEvent = null;
		this.keepTouchEvent = null;
		this.endTouchEvent = null;
		this.jumpEvent = null;
		this.isCatch = false;
	}

	/** 得到跳力的倍数,特殊跳板用 */
	public GetForceScale(): number {
		if (this.tileType == TileType.Spring_Hor) {
			return GameData.Instance.springHorForceScale;
		}
		return 1;
	}

	/** 得到跳跃的方向,特殊跳板用 */
	public GetJumpDir(): number {
		if (this.tileType == TileType.Spring_Hor) {
			return 0;
		}
		return null;
	}

	//#region Normal_Hor_Tile Normal_Ver_Tile

	private Normal_Start() {
		this.isCatch = true;
		this.node.opacity = 200;
	}

	private Normal_Hor_Keep(event: cc.Event.EventTouch) {
		let delta = event.touch.getDelta();
		let will = this.node.x + delta.x;
		this.node.x = MyU.Clamp(will, GameData.Instance.xMinBorder, GameData.Instance.xMaxBorder);
	}

	private Normal_Ver_Keep(event: cc.Event.EventTouch) {
		let delta = event.touch.getDelta();
		let will = this.node.y + delta.y;
		this.node.y = MyU.Clamp(will, this.clampDown, this.clampUp);
	}

	private Normal_Hor_End() {
		this.isCatch = false;
		this.node.opacity = 255;
	}


	//#endregion

	//#region Move_Hor_Tile

	private Move_Hor_Update(dt: number) {
		if (!this.isCatch) {
			let delta = this.moveDir * this.moveHorSpeed * dt;
			let will = this.node.x + delta;
			this.node.x = MyU.Clamp(will, GameData.Instance.xMinBorder, GameData.Instance.xMaxBorder);

			if (this.node.x == GameData.Instance.xMinBorder
				|| this.node.x == GameData.Instance.xMaxBorder) {
				this.moveDir *= -1;
			}
		}
	}

	/** 掉落 */
	private DropDown() {
		//就算是掉下去,也不着急回收,按照index回收
		this.node.runAction(cc.moveBy(0.5, 0, -500));
		this.RecoveryNoAction();
	}

	//#endregion

	//#region Touch_Break_Tile

	private Touch_Break_End() {
		if (MainGameManager.Instance.isPlaying) {
			this.node.active = false;
			MainGameManager.Instance.tileManager.SpawnTouchBreak(this);
		}
	}

	//#endregion

	//#region Spring_Hor

	//#endregion

	//#region Froze_Hor

	private Froze_Hor_Keep(event: cc.Event.EventTouch) {
		if (!this.isFrozen) {
			this.Normal_Hor_Keep(event);
		}
	}

	private Froze_Hor_End() {
		if (this.isFrozen) {
			this.touchCount--;
			if (this.touchCount == 0) {
				this.isFrozen = false;
				this.sprite.spriteFrame = GameData.Instance.tileSprites[TileType.Normal_Hor];
			}
		}
		this.Normal_Hor_End();
	}
	//#endregion
}
