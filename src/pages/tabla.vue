<template>
  <f7-page name="about">
    <f7-navbar title="About" back-link="Back"></f7-navbar>
    <f7-block-title>DynamoDB Test</f7-block-title>
    <f7-row>
      <f7-col width="50" style="margin: 0px auto;">
        <f7-button fill @click="addData">Agregar</f7-button>
      </f7-col>
    </f7-row>
    <f7-block>
      <div class="data-table card">
        <table>
          <thead>
            <tr>
              <th class="label-cell">Nombre</th>
              <th class="numeric-cell">Edad</th>
              <th class="numeric-cell tth"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.id">
              <td class="label-cell">{{ item.nombre }}</td>
              <td class="numeric-cell">{{ item.edad }}</td>
              <td class="numeric-cell tth">
                <f7-link @click="deleteData(item.id)"
                  ><f7-icon f7="trash"></f7-icon
                ></f7-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </f7-block>
  </f7-page>
</template>
<script>
import API, { graphqlOperation } from "@aws-amplify/api";
import PubSub from "@aws-amplify/pubsub";
import awsconfig from "./../aws-exports";

import { listTodos } from "./../graphql/queries";
import { onCreateTodo, onDeleteTodo } from "./../graphql/subscriptions";
import { createTodo, deleteTodo } from "./../graphql/mutations";

export default {
  data() {
    return {
      items: [],
      toast: this.$f7.toast.create({
        text: "Datos Actualizados",
        closeTimeout: 2000,
        destroyOnClose: null,
        closeButton: true,
        closeButtonText: "Cerrar",
        closeButtonColor: "white"
      })
    };
  },
  mounted() {
    API.configure(awsconfig);
    PubSub.configure(awsconfig);
    this.listData();
    const self = this;
    //! suscribe al evento de crear
    API.graphql(graphqlOperation(onCreateTodo)).subscribe({
      next: async evt => {
        console.log("Mensaje PubHub Create");
        const todo = evt.value.data.onCreateTodo;
        console.log(todo);
        self.$f7.toast.show({
          text: "Actualizando tabla.."
        });
        const codigo = await self.buscaReg(todo.id);
        if (codigo === -1) {
          self.items.push({
            id: todo.id,
            nombre: todo.nombre,
            edad: todo.edad
          });
        }
      }
    });
    //! suscribe al evento de borrado
    API.graphql(graphqlOperation(onDeleteTodo)).subscribe({
      next: async evt => {
        console.log("Mensaje PubHub Delete");
        const todo = evt.value.data.onDeleteTodo;
        self.$f7.toast.show({
          text: "Registro eliminado"
        });
        const codigo = await self.buscaReg(todo.id);
        console.log(codigo);
        self.items.splice(codigo, 1);
      }
    });
  },
  methods: {
    async buscaReg(id) {
      const self = this;
      let valor = -1;
      for (let index = 0; index < self.items.length; index++) {
        const element = self.items[index];
        if (element.id === id) {
          valor = index;
        }
      }
      return valor;
    },
    async listData() {
      const { data } = await API.graphql(graphqlOperation(listTodos));
      console.log(data.listTodos.items);
      this.items = data.listTodos.items;
    },
    async addData() {
      const self = this;
      self.$f7.dialog.prompt(
        "Ingresa tu nombre",
        "Nuevo Registro",
        nombre => {
          self.$f7.dialog.prompt(
            "Ingresa tu Edad",
            "Nuevo Registro",
            async edad_ => {
              let edad = Number(edad_.trim());
              if (isNaN(edad)) edad = 0;
              const todo = { nombre, edad };
              self.$f7.preloader.show();
              await API.graphql(graphqlOperation(createTodo, { input: todo }));
              self.$f7.preloader.hide();
            },
            cancel => {
              console.log("valor de cancel ", cancel);
            }
          );
        },
        cancel => {
          console.log("valor de cancel ", cancel);
        }
      );
    },
    async deleteData(id) {
      this.$f7.dialog.confirm(
        "Desea eliminar este registro?",
        "CUIDADO!",
        async callbackOk => {
          console.log(id);
          await API.graphql(
            graphqlOperation(deleteTodo, {
              input: {
                id: id
              }
            })
          );
        }
      );
    }
  }
};
</script>
<style>
.tth {
  width: 30px;
}
</style>
