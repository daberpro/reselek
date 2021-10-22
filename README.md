# Seleku JS 
![alt text](https://selekudev.github.io/icon.png)

## konsep
seleku merupakan framework frontend jaascript yang di desain khusus dengan berbagai fitur seperti reactivity, data binding dan berbagai macam fitur lain

## kenapa seleku
saat ini terdapat banyak framework frontend modern seperti react, svelte dan lain - lain
seleku memiliki cara kerja yang dengan tujuan yang sama seperti framewrok frontend modern lain tetapi seleku memiliki cara kerja yang berbeda

# User Guide
## instalasi
untuk melakukan penginstalan seleku anda membutuhkan beberapa hal berikut
1. node js
2. pemahaman tentang javascript (es5 hingga versi terbaru)
3. dan penggunaan npm (node package manager)

untuk melakukan instalasi cli anda dapat menginstall seleku secara global melalui npm di komputer anda dengan command atau perintah berikut

```bash
npm i -g seleku@latest
``` 

kemudian lakukan pengecekan dengan mengetikan 
```bash
seleku
```

## pemahaman dasar

seleku menggunakan component dengan bentukan virtual DOM dan melakukan update melalui DOM TREE

seleku melakukan binding dari javascript ke html menggunakan props, props merupakan object yang menjadi penghubung antara data yang terdapat di javascript ke html

### struktur dasar
seleku menggunakan struktur seperti html biasa akan tetapi seleku hanya akan mengambil satu element pertama yang akan di jadikan sebagai component sebagai contoh

```html
<!--h1 yang akan di jadikan sebagai component-->
<h1> hello world </h1>

<!--div akan di abaikan karena hanya 1 element utama yang akan di ambil-->
<div class="card"> hello world </div>

```
untuk mengatasi hal tersebut di sarankan untuk memuat semua element di dalam 1 tag khusus seperti div atau sejenisnya (semua element umumnya bisa)

untuk memasukan custom script dari seleku cukup masukan tag script ke dalam struktur contoh

```html
<!--h1 yang akan di jadikan sebagai component-->
<h1> hello world </h1>

<!--div akan di abaikan karena hanya 1 element utama yang akan di ambil-->
<div class="card"> hello world </div>

<script>

	console.log("hello world");
    
</script>
```

begitu pula untuk style
### props

untuk  membuat props cukup memasukan attribute `props="nama props"` sebagai contoh dan anda dapat melakukan binding di dalam content dengan menggunakan `{{nama props}}`

```html
<h1 props="nama_user">

	hallo {{nama_user}}
	
</h1>
```

untuk mengisi nilai dari props anda dapat menggunakan update state yang di miliki oleh seleku

### state
seleku memiliki state yang di mana state di gunakan untuk membuat atau menetapkan perubahan pada props terdapat 2 jenis state di dalam seleku 
##### global state
yaitu state yang dapat mengakses semua props di dalam component dan umumnya untuk menggunakan nya dengan cara menuliskan nama file di ikuti dengan update state contoh
	
  ```js
   //misalkan kita memiliki file utama atau main file
   //dengan nama app.seleku
   
   app.state.nama = "daberdev"
  ```
  
contoh penerapan pada struktur dengan nama file main nya adalah app.seleku 
  
 ```html
<h1 props="nama_user">

	hallo {{nama_user}}
	
</h1>

<script>

app.state.nama_user = "daberdev";

</script>
```
