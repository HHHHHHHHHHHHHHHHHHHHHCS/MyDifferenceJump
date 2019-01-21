import MyU from "./My/MyU";
import GameData from "./GameData";

/** 敌人的类型 */
export enum EnemyType {
	None,
	Enemy1,
	Enemy2,
	Enemy3,
}

const { ccclass, property } = cc._decorator;

@ccclass
/** 敌人 */
export default class EnemyBase extends cc.Component {
	private static halfX;

	private enemyType: EnemyType;
	private enemy1: cc.Node;
	private enemy2: cc.Node;
	private enemy3: cc.Node;

	private moveDir: number;
	private moveSpeed: number;
	private xMinBorder: number;
	private xMaxBorder: number;

	onLoad() {
		if (EnemyBase.halfX == undefined) {
			EnemyBase.halfX = this.node.width / 2;
		}

		this.enemy1 = cc.find("Enemy1", this.node);
		this.enemy2 = cc.find("Enemy2", this.node);
		this.enemy3 = cc.find("Enemy3", this.node);
	}

	public OnInit(type: EnemyType) {
		this.enemyType = type;
		this.HideAll();
		let gameData = GameData.Instance;
		switch (type) {
			case EnemyType.Enemy1: {
				this.enemy1.active = true;
				this.moveDir = 0;
				break;
			}
			case EnemyType.Enemy2: {
				this.enemy2.active = true;
				this.moveDir = MyU.RandomNumber(-1, 1);
				this.xMinBorder = gameData.xMinBorder + EnemyBase.halfX;
				this.xMaxBorder = gameData.xMaxBorder - EnemyBase.halfX;
				this.moveSpeed = gameData.enemy2Speed;
				break;
			}
			case EnemyType.Enemy3: {
				this.enemy3.active = true;
				this.moveDir = MyU.RandomNumber(-1, 1);
				this.xMinBorder = gameData.xMinBorder - EnemyBase.halfX;
				this.xMaxBorder = gameData.xMaxBorder + EnemyBase.halfX;
				this.moveSpeed = gameData.enemy3Speed;
				break;
			}
		}
	}

	public HideAll() {
		this.enemy1.active = false;
		this.enemy2.active = false;
		this.enemy3.active = false;
	}

	public OnUpdate(dt: number) {
		if (this.enemyType == EnemyType.Enemy2) {
			this.node.x += this.moveDir * this.moveSpeed * dt;
			if (this.node.x <= this.xMinBorder) {
				this.moveDir = 1;
			}
			else if (this.node.x >= this.xMaxBorder) {
				this.moveDir = -1;
			}
		}
		else if (this.enemyType == EnemyType.Enemy3) {
			this.node.x += this.moveDir * this.moveSpeed * dt;
			if (this.node.x <= this.xMinBorder) {
				this.node.x = this.xMaxBorder;
			}
			else if (this.node.x >= this.xMaxBorder) {
				this.node.x = this.xMinBorder;
			}
		}
	}
}
