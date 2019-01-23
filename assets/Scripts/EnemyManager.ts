import EnemyBase, { EnemyType } from "./EnemyBase";
import ObjectPool from "./ObjectPool";
import GameData from "./GameData";
import TileManager from "./TileManager";
import MainGameManager from "./MainGameManager";
import MyU from "./My/MyU";
import TileBase from "./TileBase";
import EnemyRocketBase from "./EnemyRocketBase";

/** 敌人管理器 */
export default class EnemyManager {
	private nowEnemyList: EnemyBase[];
	private enemyPool: ObjectPool<EnemyBase>;

	private tileManager: TileManager;
	private gameData: GameData;

	private enemyIndex: number;//敌人出现的index

	private enemyRocket: EnemyRocketBase;//敌人火箭
	private enemyRocketIsShow: boolean;//敌人火箭是否显示

	public constructor() {
		this.gameData = GameData.Instance;
		this.tileManager = MainGameManager.Instance.tileManager;

		let parent = cc.find("World/EnemyParent");
		this.nowEnemyList = [];
		this.enemyPool = new ObjectPool(this.gameData.enemyPrefab, EnemyBase, 0, parent);

		this.enemyRocket = cc.instantiate(this.gameData.enemyRocketPrefab).getComponent(EnemyRocketBase);
		this.enemyRocket.node.setParent(parent);
		this.enemyRocket.node.active = false;

		this.enemyIndex = this.gameData.enemyNext;
	}


	public OnUpdate(dt: number) {
		if (this.enemyRocketIsShow) {
			this.enemyRocket.OnUpdate(dt);
		}
		this.nowEnemyList.forEach(enemy => {
			enemy.OnUpdate(dt);
		});
	}


	public NeedCheckCreateEnemy(): EnemyType {
		if (this.tileManager.currentTileIndex < this.enemyIndex) {
			return EnemyType.None;
		}

		let rd = MyU.Random(0, this.gameData.allEnemyWeight);

		if (rd <= this.gameData.enemyNoneWeight) {
			return EnemyType.None;
		}

		let enemyType = EnemyType.None;

		if (rd <= this.gameData.enemy1Weight) {
			enemyType = EnemyType.Enemy1;
		}
		else if (rd <= this.gameData.enemy2Weight) {
			enemyType = EnemyType.Enemy2;
		}
		else if (rd <= this.gameData.enemy3Weight) {
			enemyType = EnemyType.Enemy3;
		}

		if (enemyType != EnemyType.None) {
			this.enemyIndex = this.tileManager.currentTileIndex + this.gameData.enemyNext;
		}

		return enemyType;
	}

	/** 创建敌人 */
	public CreateEnemy(tile: TileBase) {
		this.SpawnEenmyRocket(tile);
		let enemyType = this.NeedCheckCreateEnemy();
		if (enemyType != EnemyType.None) {
			var enemy = this.enemyPool.Get();
			enemy.OnInit(enemyType, tile.node.y);
			this.nowEnemyList.push(enemy);
		}
	}

	/** 执行敌人 */
	public OnRecovery(cameraY: number) {
		let recoveryY = cameraY - this.gameData.recoveryEnemyY;

		for (let i = this.nowEnemyList.length - 1; i >= 0; i--) {
			var enemy = this.nowEnemyList[i];
			if (enemy.node.y <= recoveryY) {
				this.RecoveryEnemy(enemy);
			}
		}

	}

	/** 回收敌人 */
	public RecoveryEnemy(enemy: EnemyBase) {
		enemy.Recovery();
		this.nowEnemyList.Remove(enemy);
		this.enemyPool.Put(enemy);
	}

	/** 生成敌人的火箭 */
	public SpawnEenmyRocket(tile: TileBase) {
		if (!this.enemyRocketIsShow && MyU.Random01() <= this.gameData.enemyRocketWeight
			&& this.tileManager.currentTileIndex >= this.gameData.enemyRocketStartIndex) {
			this.enemyRocketIsShow = true;
			this.enemyRocket.OnInit(tile.node.y);
		}
	}


	/** 回收火箭 */
	public RecoveryEenmyRocket() {
		this.enemyRocketIsShow = false;
		this.enemyRocket.node.active = false;
	}
}