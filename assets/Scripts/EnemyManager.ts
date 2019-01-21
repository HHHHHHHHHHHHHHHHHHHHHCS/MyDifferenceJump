import EnemyBase, { EnemyType } from "./EnemyBase";
import ObjectPool from "./ObjectPool";
import GameData from "./GameData";
import TileManager from "./TileManager";
import MainGameManager from "./MainGameManager";
import MyU from "./My/MyU";

/** 敌人管理器 */
export default class EnemyManager {
	private nowEnemyList: EnemyBase[];
	private enemyPool: ObjectPool<EnemyBase>;

	private tileManager: TileManager;
	private gameData: GameData;

	private enemyIndex: number;//敌人出现的index

	public constructor() {
		this.gameData = GameData.Instance;
		this.tileManager = MainGameManager.Instance.tileManager;

		let parent = cc.find("World/EnemyParent");
		this.nowEnemyList = [];
		this.enemyPool = new ObjectPool(this.gameData.itemPrefab, EnemyBase, 0, parent);

		this.enemyIndex = this.gameData.enemyNext;
	}


	public OnUpDate() {

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

		if (rd <= this.gameData.enemy2Weight) {
			enemyType = EnemyType.Enemy2;
		}

		if (rd <= this.gameData.enemy3Weight) {
			enemyType = EnemyType.Enemy3;
		}

		if (enemyType != EnemyType.None) {
			this.enemyIndex = this.tileManager.currentTileIndex + this.gameData.enemyNext;
		}

		return enemyType;
	}

	public CreateEnemy() {
		let enemyType = this.NeedCheckCreateEnemy();
		if (enemyType != EnemyType.None) {
			var enemy = this.enemyPool.Get();
			enemy.OnInit(enemyType);
			this.nowEnemyList.push(enemy);
		}
	}

}