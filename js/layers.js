addLayer("c", {
    name: "civilization", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#edb3ff",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "population", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    tabFormat: ["main-display",
		"prestige-button",
		["display-text",
			function() {return 'You have ' + format(player.points) + ' points.'},
				{}],
		"blank",
		["display-text",
			function() {return 'Your best buyabucks is ' + formatWhole(player.b.best) + '.<br>You have made a total of '+formatWhole(player.b.total)+" buyabucks."},
				{}],
		"blank",
        "buyables",],
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "c", description: "C: Perform a row 1 reset for population", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    buyables: {
    	rows: 2,
		cols: 3,
        11: {
            title: "Civilization 1",
            unlocked() { return player[this.layer].unlocked }, 
            cost(x=player[this.layer].buyables[this.id]) { 
                let base = new Decimal(1)
                base = base.add(x)
                return base
            },
            effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
                let eff = new Decimal(1)
                eff = eff.times(x)
                return eff
            },
            display() { return 'Multiplies point gain.<br>Currently: ' +  format(buyableEffect(this.layer, this.id)) + 'x<br>Cost: ' + formatWhole(this.cost()) + ' population<br>Level: ' + formatWhole(player[this.layer].buyables[this.id])},
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
    },
    layerShown(){return true}
})
