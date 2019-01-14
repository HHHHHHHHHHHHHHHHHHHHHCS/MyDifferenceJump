import GameData from "./GameData";
import MyU from "./My/MyU";

const { ccclass, property } = cc._decorator;

export const enum TileType {
	Normal_Hor = 0,
	Normal_Ver,
	Move_Hor,
	Broken_Hor,
	Spring_Hor,
	Touch_Hor
}

@ccclass
export default class TileBase extends cc.Component {

	private tileType: TileType;

	private sprite: cc.Sprite;

	private startTouchEvent: Function;
	private keepTouchEvent: Function;
	private endTouchEvent: Function;

	private clampUp: number;//上的限制
	private clampDown: number;//下的限制

	public get TileType() {
		return this.tileType;
	}

	protected onLoad() {
		this.sprite = this.node.getChildByName("TileImage").getComponent(cc.Sprite);

		this.node.on(cc.Node.EventType.TOUCH_START, this.StartTouch, this);
		this.node.on(cc.Node.EventType.TOUCH_MOVE, this.KeepTouch, this);
		this.node.on(cc.Node.EventType.TOUCH_END, this.EndTouch, this);
		this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.EndTouch, this);
	}

	public Init(type: TileType, pos: cc.Vec2) {
		this.node.active = true;
		this.tileType = type;
		this.sprite.spriteFrame = GameData.Instance.tileSprites[this.tileType];
		this.node.position = pos;
		this.SwichType();
		this.RegisterEvent();
	}

	private SwichType() {
		switch (this.tileType) {
			case TileType.Normal_Hor: {
				this.clampUp = this.node.position.y + GameData.horMoveClamp;
				this.clampDown = this.node.position.y - GameData.horMoveClamp;
				break;
			}
		}
	}

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
		}
	}

	private StartTouch(event: cc.Event.EventTouch) {
		if (this.startTouchEvent) {
			this.startTouchEvent();
		}
		event.stopPropagation();
	}

	private KeepTouch(event: cc.Event.EventTouch) {
		if (this.keepTouchEvent) {
			this.keepTouchEvent(event)
		}
		event.stopPropagation();
	}

	private EndTouch(event: cc.Event.EventTouch) {
		if (this.endTouchEvent) {
			this.endTouchEvent(event)
		}
		event.stopPropagation();
	}

	public Recovery() {
		//this.node.off(cc.Node.EventType.TOUCH_START, this.StartTouch, this);
		//this.node.off(cc.Node.EventType.TOUCH_MOVE, this.KeepTouch, this);
		//this.node.off(cc.Node.EventType.TOUCH_END, this.EndTouch, this);
		//this.node.off(cc.Node.EventType.TOUCH_Cancel, this.EndTouch, this);

		this.startTouchEvent = null;
		this.keepTouchEvent = null;
		this.endTouchEvent = null;
	}

	//#region Normal_Hor_Tile Normal_Ver_Tile

	private Normal_Start() {
		this.node.opacity = 200;
	}

	private Normal_Hor_Keep(event: cc.Event.EventTouch) {
		let delta = event.touch.getDelta();
		let will = this.node.x + delta.x;
		this.node.x = MyU.Clamp(will, GameData.xMinBorder, GameData.xMaxBorder);
	}

	private Normal_Ver_Keep(event: cc.Event.EventTouch) {
		let delta = event.touch.getDelta();
		let will = this.node.y + delta.y;
		this.node.y = MyU.Clamp(will, this.clampDown, this.clampUp);
	}

	private Normal_Hor_End() {
		this.node.opacity = 255;
	}

	//#endregion
}
