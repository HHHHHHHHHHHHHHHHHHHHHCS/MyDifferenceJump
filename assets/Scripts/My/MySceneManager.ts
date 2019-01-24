/** 我的场景管理器 */
export default class MySceneManager {
	/** 重新加载当前场景 */
	public static ReLoadScene() {
		cc.director.loadScene(cc.director.getScene().name);
	}

	/** 加载场景 */
	public static LoadScene(sceneName: string) {
		cc.director.loadScene(sceneName);
	}
}