# 先搶先答
搶答時，當有很多人都舉手要答題時，總會讓我不知道該怎麼公平的選人來回答問題!!!
那就透過"先搶先答"來幫我選人

# Windows 的使用步驟：
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