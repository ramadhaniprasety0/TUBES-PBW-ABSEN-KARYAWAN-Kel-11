package Karywancontroller

import (
	"dashboard/models"
	"encoding/json"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"html/template"
	"log"
	"net/http"
)

var db *gorm.DB

var templates *template.Template

func InitKaryawanController(database *gorm.DB, tmpl *template.Template) {
	db = database
	templates = tmpl
}

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func LoginUser(c *gin.Context) {
	username := c.PostForm("username")
	password := c.PostForm("password")

	var user models.Karyawan

	if err := db.Where("username = ?", username).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Username atau Password Salah"})
		return
	}

	// Verifikasi password hash
	if !CheckPasswordHash(password, user.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Username atau Password Salah"})
		return
	}

	session := sessions.Default(c)
	session.Set("user_id", user.Id)
	session.Save()

	c.JSON(http.StatusOK, gin.H{"message": "Login Berhasil", "redirect": "/karyawan/dashboard"})
}

func LogoutUser(c *gin.Context) {
	session := sessions.Default(c)
	session.Delete("user_id")
	session.Save()
	c.Redirect(http.StatusMovedPermanently, "/login/karyawan")
}

func AuthRequired(c *gin.Context) {
	session := sessions.Default(c)
	userID := session.Get("user_id")
	if userID == nil {
		c.Redirect(http.StatusSeeOther, "/login/karyawan")
		return
	}
	c.Next()
}

func ShowDashboard(c *gin.Context) {
	session := sessions.Default(c)
	userID := session.Get("user_id")

	var user models.Karyawan
	if err := db.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	data := gin.H{
		"id":            user.Id,
		"nama_karyawan": user.NamaKaryawan,
		"deskripsi":     user.Deskripsi,
	}

	if err := templates.ExecuteTemplate(c.Writer, "dashboardkaryawan.html", data); err != nil {
		c.String(http.StatusInternalServerError, err.Error())
	}
}

func Index(c *gin.Context) {
	var karyawan []models.Karyawan
	db.Find(&karyawan)
	c.JSON(http.StatusOK, gin.H{"karyawan": karyawan})
}

func Show(c *gin.Context) {
	var karyawan models.Karyawan
	id := c.Param("id")

	if err := db.First(&karyawan, id).Error; err != nil {
		switch err {
		case gorm.ErrRecordNotFound:
			c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"message": "Data tidak ditemukan"})
			return
		default:
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"karyawan": karyawan})
}

func Create(c *gin.Context) {
	var karyawan models.Karyawan
	if err := c.ShouldBindJSON(&karyawan); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	log.Println("Received Karyawan:", karyawan) // Tambahkan log ini untuk debug

	// Hash the password before saving
	hashedPassword, err := HashPassword(karyawan.Password)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "Failed to hash password"})
		return
	}
	karyawan.Password = hashedPassword

	log.Println("Karyawan before saving to DB:", karyawan) // Log data sebelum menyimpan ke DB

	db.Create(&karyawan)
	c.JSON(http.StatusOK, gin.H{"karyawan": karyawan})
}

func Update(c *gin.Context) {
	var karyawan models.Karyawan
	id := c.Param("id")

	if err := c.ShouldBindJSON(&karyawan); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	if db.Model(&karyawan).Where("id = ?", id).Updates(&karyawan).RowsAffected == 0 {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": "tidak dapat mengupdate karyawan"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Data berhasil diperbarui"})
}

func Delete(c *gin.Context) {
	var karyawan models.Karyawan
	var input struct {
		Id json.Number
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	id, _ := input.Id.Int64()

	// Hapus terlebih dahulu data absensi yang terhubung dengan karyawan
	if err := db.Where("karyawan_id = ?", id).Delete(&models.Absensi{}).Error; err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "Gagal menghapus absensi terkait"})
		return
	}

	// Setelah data absensi dihapus, baru hapus karyawan
	if db.Delete(&karyawan, id).RowsAffected == 0 {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": "Tidak dapat menghapus karyawan"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Data berhasil dihapus"})
}

func CountKaryawan(c *gin.Context) {
	var count int64
	if err := db.Model(&models.Karyawan{}).Count(&count).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"count": count})
}
