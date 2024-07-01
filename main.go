package main

import (
	"dashboard/controllers/Absencontroller"
	"dashboard/controllers/Karywancontroller"
	"dashboard/controllers/Usercontroller"
	"dashboard/models"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
	"html/template"
	"log"
	"net/http"
)

var templates *template.Template

func main() {
	r := gin.Default()

	// Koneksi Database
	models.ConnectDatabase()
	db := models.DB

	// Load templates dari folder
	var err error
	templates, err = template.ParseGlob("templates/*.html")
	if err != nil {
		log.Fatalf("Error parsing templates: %v", err)
	}

	// Routing Static assets
	r.Static("/static", "./static")

	// Untuk koneksi database dengan template
	Usercontroller.InitUserController(db, templates)
	Karywancontroller.InitKaryawanController(db, templates)
	Absencontroller.InitAbsenController(db)

	// Middleware Session Login Admin dan karyawan
	store := cookie.NewStore([]byte("secret"))
	r.Use(sessions.Sessions("mysession", store))

	// Request Tampilan Untuk DAFTAR Admin Dashboard
	r.GET("/register", func(c *gin.Context) {
		if err := templates.ExecuteTemplate(c.Writer, "register.html", nil); err != nil {
			c.String(http.StatusInternalServerError, err.Error())
		}
	})

	// Request Tampilan Untuk LOGIN Admin Dashboard
	r.GET("/", func(c *gin.Context) {
		if err := templates.ExecuteTemplate(c.Writer, "login.html", nil); err != nil {
			c.String(http.StatusInternalServerError, err.Error())
		}
	})
	r.POST("/register", Usercontroller.RegisterUser)
	r.POST("/login", Usercontroller.LoginUser)
	r.GET("/logout", Usercontroller.LogoutUser)

	// Request Tampilan Untuk LOGIN KARYAWAN
	r.GET("/login/karyawan", func(c *gin.Context) {
		if err := templates.ExecuteTemplate(c.Writer, "loginkaryawan.html", nil); err != nil {
			c.String(http.StatusInternalServerError, err.Error())
		}
	})
	r.POST("/login/karyawan", Karywancontroller.LoginUser)
	r.GET("/logout/karyawan", Karywancontroller.LogoutUser)

	// Autentikasi Login ke dashboard Absen Karyawan
	autkaryawan := r.Group("/login/karyawan")
	autkaryawan.Use(Karywancontroller.AuthRequired)
	{
		r.GET("/karyawan/dashboard", Karywancontroller.ShowDashboard)
	}

	// autentikasi Login ke dashboard ADMIN
	authorized := r.Group("/")
	authorized.Use(Usercontroller.AuthRequired)
	{
		authorized.GET("/dashboard", Usercontroller.ShowDashboard)

		// Request Tampilan Untuk Menu Tambah Karyawan
		authorized.GET("/add", func(c *gin.Context) {
			if err := templates.ExecuteTemplate(c.Writer, "add.html", nil); err != nil {
				c.String(http.StatusInternalServerError, err.Error())
			}
		})

		// Request Tampilan Untuk Menu Admin
		authorized.GET("/admin", func(c *gin.Context) {
			if err := templates.ExecuteTemplate(c.Writer, "admin.html", nil); err != nil {
				c.String(http.StatusInternalServerError, err.Error())
			}
		})

		// Request Tampilan Untuk Menu Absen
		authorized.GET("/absen", func(c *gin.Context) {
			if err := templates.ExecuteTemplate(c.Writer, "absen.html", nil); err != nil {
				c.String(http.StatusInternalServerError, err.Error())
			}
		})

		// Request Tampilan Untuk Tampilan Data Absen
		r.GET("/data/absen", func(c *gin.Context) {
			if err := templates.ExecuteTemplate(c.Writer, "tabelabsen.html", nil); err != nil {
				c.String(http.StatusInternalServerError, err.Error())
			}
		})

		// API Data Karyawan
		authorized.GET("/api/karyawan", Karywancontroller.Index)
		authorized.GET("/api/karyawan/:id", Karywancontroller.Show)
		authorized.POST("/api/tambahkaryawan", Karywancontroller.Create)
		authorized.PUT("/api/karyawan/:id", Karywancontroller.Update)
		authorized.DELETE("/api/karyawan/:id", Karywancontroller.Delete)
		authorized.GET("/api/totalkaryawan", Karywancontroller.CountKaryawan)

		// API Data Admin
		authorized.GET("/api/admin", Usercontroller.Index)
		authorized.PUT("/api/admin/edit/:id", Usercontroller.Update)
		authorized.DELETE("/api/admin/hapus/:id", Usercontroller.Delete)

		// API Absen Karyawan
		authorized.GET("/api/absensi", Absencontroller.Tampil)
		authorized.POST("/api/hadir", Absencontroller.Kehadiran)
		authorized.GET("/api/total/hadir", Absencontroller.Jumlahhadir)
		authorized.GET("/api/total/tidak/hadir", Absencontroller.Jumlahtidakhadir)
	}

	// Port Server
	r.Run(":8393")
}
