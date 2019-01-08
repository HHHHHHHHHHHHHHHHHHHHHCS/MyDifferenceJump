const { ccclass, property } = cc._decorator;

export const enum Tags {
	Player = 0,
	Tile,
}

@ccclass
/** 
 * 必须要在MainGameManager上面 脚本执行顺序问题 
 * 
 * 
 * */
export default class GameData extends cc.Component {
	private static instance: GameData;

	public static get Instance() {
		return GameData.instance;
	}

	@property(cc.Prefab)
	public tilePrefab: cc.Prefab = null;

	@property([cc.SpriteFrame])
	public tileSprites: cc.SpriteFrame[] = [];

	onLoad() {
		GameData.instance = this;
	}
}