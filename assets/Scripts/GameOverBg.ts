import MyU, { ClickEvent } from "./My/MyU";
import SceneManager from "./SceneManager";
import GameGameManager, { WX } from "./GameGameManager";
import MyStorageManager, { StorageEnum } from "./My/MyStorageManager";
import GameData from "./GameData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameOverBg extends cc.Component {
	private nowScoreText: cc.Label;
	private highScoreLabel: cc.RichText;
	private highScoreText: cc.Label;
	private reviveButton: cc.Button;

	protected onLoad() {
		this.nowScoreText = cc.find("NowScoreText", this.node).getComponent(cc.Label);
		this.highScoreLabel = cc.find("HighScoreLabel", this.node).getComponent(cc.RichText);
		this.highScoreText = cc.find("HighScoreText", this.node).getComponent(cc.Label);
		this.reviveButton = cc.find("ReviveButton", this.node).getComponent(cc.Button);
		let againButton = cc.find("AgainButton", this.node);
		let backMenuButton = cc.find("BackMenuButton", this.node);

		this.reviveButton.node.on(ClickEvent, this.ClickReivive, this);
		againButton.on(ClickEvent, this.ClickAgain, this);
		backMenuButton.on(ClickEvent, this.ClickBackMenu, this);
	}


	public Show() {
		this.node.active = true;
		this.nowScoreText.string = GameGameManager.Instance.NowScore.toString();
		this.reviveButton.interactable = !GameGameManager.Instance.IsReivived;
		if (GameData.IsNormalMode) {
			this.highScoreLabel.string = "<color=0><b>正常最高分数</b></color>";
			this.highScoreText.string = MyStorageManager.GetFloat(StorageEnum.NormalHighScore).toString();
		}
		else {
			this.highScoreLabel.string = "<color=0><b>噩梦最高分数</b></color>";
			this.highScoreText.string = MyStorageManager.GetFloat(StorageEnum.NightmareHighScore).toString();
		}
	}

	public ClickReivive(event: cc.Button) {
		this.reviveButton.interactable = false;
		if (CC_WECHATGAME) {
			//开启右上角的分享
			WX.showShareMenu({
				withShareTicket: true
			});

			//监听右上角的分享调用
			WX.shareAppMessage(function () {
				return {
					title: '爱的跳跃转圈圈!!!',
					imageUrlId: 'QmfVyTWRRdywJMP2ptHOrg',
					imageUrl: 'https://mmocgame.qpic.cn/wechatgame/AkyzNsiboWt2A1gfRNu6FyF9vSLTIYQsnRuT1GfLJt9fSAhpSCic0JSdmFviapz5YUJ/0',
					success() {
						console.log("转发成功!!!");
						WX.showToast({
							title: '分享成功',
						});
						GameGameManager.Instance.DoReivive();
					}
				};
			}());
		}
		else {
			GameGameManager.Instance.DoReivive();
		}
		this.node.active = false;
	}


	public ClickAgain(event: cc.Button) {
		SceneManager.ReLoadScene();
	}

	public ClickBackMenu(event: cc.Button) {
		SceneManager.LoadMenuScene();
	}
}
