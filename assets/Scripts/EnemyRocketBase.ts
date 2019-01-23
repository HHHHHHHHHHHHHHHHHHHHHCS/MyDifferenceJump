import GameData from "./GameData";
import MyU from "./My/MyU";
import MainGameManager from "./MainGameManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class EnemyRocketBase extends cc.Component {
	private gameData: GameData;
	private halfY: number;//一半的Y
	private moveSpeed: number;//移动的速度
	private touchLastX: number;//触摸点击最后的X
	private touchSpeed: number;//点击的速度
	private isCatch: boolean;//是否抓住
	private needSetSpeed: boolean;//需要设置速度
	private isInView = false;//在视野内被没有执行过

	protected onLoad() {
		this.gameData = GameData.Instance;
		this.halfY = this.gameData.halfYBorder + this.node.height / 2;
		this.moveSpeed = this.gameData.enemyRocketSpeed;
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

	public OnInit(cameraY: number) {
		this.isCatch = false;
		this.needSetSpeed = false;
		this.isInView = true;
		this.touchSpeed = undefined;
		let rdX = MyU.Random(this.gameData.xMinBorder, this.gameData.xMaxBorder);
		this.node.setPosition(rdX, cameraY + this.gameData.enemyRocketHeight);
		MainGameManager.Instance.mainUIManager.ShowDangerousTip(rdX);
		this.node.active = true;
	}

	public OnUpdate(dt: number) {
		if (this.node.y >= MainGameManager.Instance.lastRecoveryY + this.halfY) {
			//还在顶部
		}
		else if (this.node.y <= MainGameManager.Instance.lastRecoveryY - this.halfY) {
			//要被回收
			MainGameManager.Instance.enemyManager.RecoveryEenmyRocket();
		}
		else {
			//视野内
			if (this.isInView) {
				MainGameManager.Instance.mainUIManager.HideDangerousTip();
				this.isInView = false;
			}
		}

		if (!this.isCatch && this.needSetSpeed) {
			//这里用两倍的甩开速度
			this.touchSpeed = 2 * (this.node.x - this.touchLastX) / dt;
			this.needSetSpeed = false;
		}

		this.node.y -= this.moveSpeed * dt;
		if (this.touchSpeed != undefined) {
			this.node.x += this.touchSpeed * dt;
		}
		MyU.Log("pos");
	}

	private StartTouch(event: cc.Event.EventTouch) {
		this.isCatch = true;
	}

	private KeepTouch(event: cc.Event.EventTouch) {
		this.touchLastX = this.node.x;
		this.node.x += event.touch.getDelta().x;
		this.needSetSpeed = true;
	}

	private EndTouch(event: cc.Event.EventTouch) {
		this.isCatch = false;
	}

}
