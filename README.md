<img src="https://selekudev.github.io/icon.png" width="50%"/>

# Seleku JS
# alpha version 

## 🧠 konsep
seleku merupakan framework frontend javascript yang di desain khusus dengan berbagai fitur seperti reactivity, data binding dan berbagai macam fitur lain, seleku menggunakan vanilla js sehingga akan berjalan cepat di web browser

## kenapa seleku ?
saat ini terdapat banyak framework frontend modern seperti react, svelte dan lain - lain
seleku memiliki cara kerja yang dengan tujuan yang sama seperti framewrok frontend modern lain tetapi seleku memiliki cara kerja yang berbeda

# 🕹 User Guide
## 📥 instalasi
untuk melakukan penginstalan seleku anda membutuhkan beberapa hal berikut
1. 👉 node js
2. 👉 pemahaman tentang javascript (es5 hingga versi terbaru)
3. 👉 dan penggunaan npm (node package manager)

untuk melakukan instalasi cli anda dapat menginstall seleku secara global melalui npm di komputer anda dengan command atau perintah berikut

```bash
npm i -g seleku@latest
``` 

kemudian lakukan pengecekan dengan mengetikan 
```bash
seleku
```
setelah membuat template silahkan masuk ke folder yang telah di buat dan silahkan jalankan peritah berikut

`npm i ` kemduian `npm run dev` untuk development mode dan `npm run build` untuk menjalankan build mode

## 🧠 pemahaman dasar

seleku menggunakan component dengan bentukan virtual DOM dan melakukan update melalui DOM TREE

seleku melakukan binding dari javascript ke html menggunakan props, props merupakan object yang menjadi penghubung antara data yang terdapat di javascript ke html

### ⚒ struktur dasar
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
### 📥📤 props

untuk  membuat props cukup memasukan attribute `props="nama props"` sebagai contoh dan anda dapat melakukan binding di dalam content dengan menggunakan `{{nama props}}`

```html
<h1 props="nama_user">

	hallo {{nama_user}}
	
</h1>
```

untuk mengisi nilai dari props anda dapat menggunakan update state yang di miliki oleh seleku dan jika terdapat lebih dari 1 props berikan spasi contoh `props="nama umur"`

#### `🍂 inherit:props`
`inherit:props` atau props turunan merupakan props yang di turunkan dari suatu component ke pada children nya sebagai contoh di dalam suatu component misalnya `h1` terdapat suatu `span` jika h1 memiliki `inherit:props` maka props yang di minta oleh element children akan di turunkan dari props parent component

### 📈 state
seleku memiliki state yang di mana state di gunakan untuk membuat atau menetapkan perubahan pada props terdapat 2 jenis state di dalam seleku 
##### 📎 global state
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
##### 📎 local state
merupakan state yang hanya mengakses props dari component yang lebih spesifik untuk
mengakses component secara spesisifik yaitu dengan menggunakan `@id` dan di akses menggunakan method `find(args: id)`, `@id` berbeda dengan id biasa `@id` hanya terdefenisi untuk component bukan element html jika ingin memasukan attribute id maka anda dapat memasukan seperti biasa

contoh penggunaan

 
 ```html
<h1 @id="message" props="nama_user">

	hallo {{nama_user}}
	
</h1>

<script>

find("message").state.nama_user = "daberdev";

</script>
```
### ⚙ event

seleku juga memiliki event handling dengan melakukan set event terhadap element untuk melakukan set event ke element di gunakan method 
```js
find(args: id).event.event_name
``` 
contoh

 ```html
<h1 @id="message" props="nama_user">

	hallo {{nama_user}}
	
</h1>

<script>

find("message").state.nama_user = "daberdev";

find("message").event.onclick = (args)=>{
	
    alert("aku di click");
    
}

</script>
```

### 🤝binding
seleku dapat melakukan binding yang lebih spesifik seperti melakukan penjumlahan di dalam binding memanggil fungsi, bahkan mengakses object maupun array dari props

contoh

 ```html
<h1>

	hasil 1 + 2 : {{1 + 2}}
	
</h1>

```

`pemberitahuan: seleku saat ini tidak dapat melakukan binding dari 2 props yang berbeda di dalam 1 binding`

### 💧 dynamic attribute

seleku memiliki dynamic attribute ( attribute yang dapat berubah - ubah ) dengan cara memberikan binding ke pada attribute

contoh

 ```html
<h1 @id="message" props="nama_user card" class="{{card}}">

	hallo {{nama_user}}
	
</h1>

<script>

find("message").state.nama_user = "daberdev";

find("message").state.card = "box";

</script>
```

### ✨ seleku special component

seleku juga memiliki beberapa component bawan yaitu component kondisi dan komponent perulangan

##### # condition component
untuk penggunaan condition component cukup meletakan attribute `condition="nama props"` maka children yang terdapat di dalam component akan di tampikan ketika props nya bernilai true dan akan di destroy ketika bernilai false

##### # looping component
seleku juga memiliki looping component yaitu component yang akan membuat element berdasarkan list atau array untuk penggunaan yaitu dengan cara memberikan attribute `loop="x of nama props"` dan menerapkan props pada component dengan tipe array dan membuat child component dengan attribute dari hasil looping `x`

contoh

 ```html
 <ul @id="username" props="list_user" loop="nama of list_user">
 	
    <li props="nama">nama user {{nama}}</li>
    
 </ul>

<script>

find("username").state.list_user = ["daberdev","seleku","js"]

</script>
```







