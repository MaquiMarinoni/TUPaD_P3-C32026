package com.tup.programacion3.entities;

import com.tup.programacion3.enums.Rol;
import java.util.Objects;

public class Usuario extends Base {
    private String nombre;
    private String apellido;
    private String mail;
    private String celular;
    private String contraseña;
    private Rol rol;

    // Constructor completo
    public Usuario(Long id, String nombre, String apellido, String mail, String celular, String contraseña, Rol rol) {
        super(id); // Mandamos el ID a la clase padre Base
        this.nombre = nombre;
        this.apellido = apellido;
        this.mail = mail;
        this.celular = celular;
        this.contraseña = contraseña;
        this.rol = rol;
    }

    // Getters y Setters
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }

    public String getMail() { return mail; }
    public void setMail(String mail) { this.mail = mail; }

    public String getCelular() { return celular; }
    public void setCelular(String celular) { this.celular = celular; }

    public String getContraseña() { return contraseña; }
    public void setContraseña(String contraseña) { this.contraseña = contraseña; }

    public Rol getRol() { return rol; }
    public void setRol(Rol rol) { this.rol = rol; }

    // =========================================================================
    // REGLA: Comparar por el atributo 'mail'
    // =========================================================================
    @Override
    public boolean equals(Object o) {
        if (this == o) return true; // Si es exactamente la misma posición de memoria
        if (o == null || getClass() != o.getClass()) return false; // Si es nulo o de otra clase
        Usuario usuario = (Usuario) o;
        return Objects.equals(mail, usuario.mail); // LA CLAVE: Solo compara los mails
    }

    @Override
    public int hashCode() {
        return Objects.hash(mail); // El hash se genera usando solo el mail
    }

    // =========================================================================
    // toString() (contraseña oculta por seguridad)
    // =========================================================================
    @Override
    public String toString() {
        return "Usuario{" +
                "id=" + getId() + // ID heredado de Base
                ", nombre='" + nombre + '\'' +
                ", apellido='" + apellido + '\'' +
                ", mail='" + mail + '\'' +
                ", rol=" + rol +
                '}';
    }
}
