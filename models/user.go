package models

type User struct {
	ID       int64  `gorm:"primaryKey" json:"id"`
	Username string `gorm:"unique"`
	Password string
	Nama     string `gorm:"type:varchar(300)" json:"namaadmin"`
}
