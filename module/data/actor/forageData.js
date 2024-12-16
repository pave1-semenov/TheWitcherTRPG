const fields = foundry.data.fields;

export default class ForageData extends foundry.abstract.TypeDataModel{

    static defineSchema() {

        return {
          title: new fields.StringField({initial: ''}),
        }
  }
}