import MySceneManager from "./My/MySceneManager";

/** 场景管理器 */
export default class SceneManager {
	private static readonly MenuSceneName: string = "Menu";
	private static readonly GameSceneName: string = "Game";

	public static LoadMenuScene() {
		MySceneManager.LoadScene(this.MenuSceneName);
	}

	public static LoadGameScene() {
		MySceneManager.LoadScene(this.GameSceneName);
	}

	public static ReLoadScene() {
		MySceneManager.ReLoadScene();
	}
}