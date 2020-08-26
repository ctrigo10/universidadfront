<template>
<div>
    <div v-if="$store.getters.user">
        <v-menu bottom offset-y>
            <template v-slot:activator="{ on }">
                <v-btn fab icon class="ma-0" v-on="on">
                    <v-avatar size="35" :color="`${randomColor} darken-2`">
                        <span class="subtitle-1 font-weight-medium">{{ $store.getters.user.substring(0,2) }}</span>
                    </v-avatar>
                </v-btn>
            </template>
            <v-list dense>
                <v-list-item :to="{ name: 'profile' }">
                    <v-list-item-icon class="ml-0 mr-2">
                        <v-icon>mdi-account-box</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Perfil</v-list-item-title>
                </v-list-item>
                <v-list-item link @click.stop="logout()">
                    <v-list-item-icon class="ml-0 mr-2">
                        <v-icon>mdi-lock</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Cerrar sesión</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
    </div>
    <div v-if="!$store.getters.user">
        <v-btn class="ma-2" small outlined color="white" @click="showDialogLoggin()">
            <v-icon left>mdi-account-key</v-icon>Ingresar
        </v-btn>
    </div>
    <!-- modal -->
    <v-row justify="center">
        <v-dialog v-model="dialogLoggin" max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">Iniciar Sesión</span>
                </v-card-title>
                <v-form ref="form" lazy-validation>
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="12" sm="12" md="12">
                                    <v-text-field prepend-icon="mdi-account" type="text" v-model="usuario" label="Nombre de Usuario" required color="secondary" maxlength="20" minlength="3" :rules="[rules.required, rules.usuario_min3]"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="12" md="12">
                                    <v-text-field prepend-icon="mdi-key" v-model="password" label="Contraseña" required color="secondary" maxlength="20" minlength="8" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" :rules="[rules.required, rules.password_min8]" :type="show1 ? 'text' : 'password'" counter @click:append="show1 = !show1"></v-text-field>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" dark @click="dialogLoggin = false">Cerrar</v-btn>
                        <v-btn color="secondary" dark @click="ingresar">Ingresar</v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>
    </v-row>
</div>
</template>

<script>
export default {
    name: "app-logger-user",
    data: () => ({
        usuario: "",
        password: "",
        show1: false,
        dialogLoggin: false,
        rules: {
            required: (value) => !!value || "Requerido",
            usuario_min3: (value) => value.length >= 3 || "Mínimo 3 caracteres",
            password_min8: (value) => value.length >= 8 || "Mínimo 8 caracteres",
        },
    }),
    computed: {
        randomColor() {
            let colors = [
                "red",
                "pink",
                "purple",
                "blue",
                "light-blue",
                "cyan",
                "teal",
                "green",
                "light-green",
                "amber",
                "orange",
                "deep-orange",
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        },
    },
    methods: {
        logout() {
            this.$store.dispatch("logout");
            this.$router.go("login");
        },
        showDialogLoggin() {
            this.dialogLoggin = true;
            this.usuario = this.password = "";
            if (this.$refs.form) this.$refs.form.resetValidation();
        },
        ingresar() {
            if (this.$refs.form.validate() == true) {
                console.log("bien");
                this.dialogLoggin = false;
            }
        },
    },
};
</script>
