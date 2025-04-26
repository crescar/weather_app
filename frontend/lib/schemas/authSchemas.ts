import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().nonempty("El nombre es requerido"),
  email: z.string().email("Direccion de Email Invalidad").nonempty("El Email es requerido"),
  password: z.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, "La contraseña debe tener al menos 8 caracteres, una letra y un número").nonempty("La contraseña es requerida"),
  confirmPassword: z.string().nonempty("La confirmación de contraseña es requerida"),
  }).superRefine((data, ctx) => {
    if (data.confirmPassword !== data.password) {
      ctx.addIssue({
        path: ["confirmPassword"],
        code: z.ZodIssueCode.custom,
        message: "Las contraseñas no coinciden",
      });
    }
})

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;


export const LoginSchema = z.object({
  email: z.string().email("Direccion de Email Invalidad").nonempty("El Email es requerido"),
  password: z.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, "La contraseña debe tener al menos 8 caracteres, una letra y un número").nonempty("La contraseña es requerida"),
})

export type LoginSchemaType = z.infer<typeof LoginSchema>;