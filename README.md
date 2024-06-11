# 範例應用API
說明: 提供 待辦事項、記帳本 簡易CRUD功能API

## 專案運行說明
1.於專案根目錄下新增.env.devloper檔，新增以下參數:
````
    # 開發參數
    MODE=devloper

    # databae
    MONGODB_URI=mongodb://mongodb:27017/<自訂資料表名稱>

    #app
    PORT=3000

    #密碼hash key
    KEY=<自訂key值>
````
2.執行命令
````
    docker-compose up
````

## API 文件
文件網址
````
url: http://<主機名稱>:<PORT號>/docs
例: http://localhost:3000/docs