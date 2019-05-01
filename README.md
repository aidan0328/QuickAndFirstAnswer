# 先搶先答
搶答時，當有很多人都舉手要答題時，總會讓我不知道該怎麼公平的選人來回答問題!!!
那就透過"先搶先答"來幫我選人

# 目錄：
 * Get Started in Windows
 * Get Started in Linux or Mac(OSX)

## Windows 的使用步驟：
我的環境是將所有的檔案放在 E:\QuickAndFirstAnswer

1. 下載並安裝 [node.js](https://nodejs.org/zh-tw/download/)
2. 透過以下的方式，**進入 Windows 的終端機模式**([引用](https://michaelchen.tech/windows-survival/cmd-primer/)) ：
   (1) 在 Windows 8 以前的 Windows 系統，透過左下角的 開始 (Start) ，選取 執行 (Run) 輸入 cmd 後，即可進入終端機環境。
   (2) 在 Windows 10 中，在左下角按右鍵，選 Command Prompt 即可。 
3. **進入資料夾**，在終端機模式下輸入：

    e: && cd QuickAndFirstAnswer

4. **安裝 Node.js 的套件**：

    npm install

5. **開始執行**：

    node server.js

6. 執行成功的話，會看到以下這樣的訊息，然後就可以開始**用瀏覽器使用"先搶先答"**
	*在瀏覽器的網址請輸入 xxx.xxx.xxx.xxx:8080*
	(xxx.xxx.xxx.xxx 是你電腦的 IP)
	
## Get Started in Linux and Mac(OSX):

1. Open terminal. 
	* In Mac, go into "Launcher" and inside "Utilities" apps folder, launch "Terminal" app.
	* In Ubuntu, Press [Ctrl] + [Alt] + [T] to open a terminal.
	* In other linux system, find out the application menu, then open terminal app as offical suggest.
2. Clone this git: `git clone https://github.com/aidan0328/QuickAndFirstAnswer.git ~`
If you don't have Git on your PC or Mac, using your OS default package manager to install git.
	* On Mac (OSX) - Already built into system, if not, using `apt-get` to install (you need to install Java first): 
		`apt-get install git`
	* On Linux - Maybe system are already in-built. if not, also using package manager to install git.

3. Install Node.js:
	If Node.js haven't installed on your PC or Mac, or not sure. Please follow the step:
	1. typing `node -v` to checkout the version of Node.js
	2. If got a error which said that command not found, meaning your computer haven't installed Node.js
	3. Install Node.js using package manager: `sudo apt-get install nodejs npm`
	4. Then done! you're ready to go!
4. Update Npm: `npm -g i` and `npm i` to install project node_modules
5. Enter your project dir: `cd QuickAndFirstAnswer`
6. Host the server: `node server.js`
7. Then launch web browser `http://localhost:8080`

# Credit
* [@ljcucc](https://github.com/ljcucc)
* @aidan0328
