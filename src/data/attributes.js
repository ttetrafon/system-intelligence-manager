class Attributes {
  constructor() {
    this.intro = "An introduction on how attributes work.",
    this.attributes = {},
    this.order = []
  }

  initialiseAttributes(obj) {
    if (obj["intro"]) this.intro = obj["intro"];
    if (obj["attributes"] && (typeof obj["attributes"] == 'object')) this.attributes = obj["attributes"];
    if (obj["order"]) this.order = obj["order"];
  }
}

module.exports = Attributes;