addLayer("c", {
    name: "civilization", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        best: new Decimal(0),
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
			function() {return 'Your best population is ' + formatWhole(player.c.best) + '.'},
				{}],
		"blank",
        "buyables",
        "blank",
        "upgrades"],
    canBuyMax() { return hasAchievement("a", 12) },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "c", description: "C: Perform a row 1 reset for population", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    upgrades: {
            11: {
            title: "An upgrade? In MY Civilizations?!",
            description: "Best population boosts Civilization 1 effectiveness.",
            cost: new Decimal(3),
            effect() {
                let eff = player[this.layer].best.add(1).pow(0.5).add(1)
                return eff
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
        },
    },
    buyables: {
    	rows: 1,
		cols: 1,
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
                eff = eff.add(x).add(1).times(x.times(0.5))
                if (hasUpgrade('c', 11)) eff = eff.times(upgradeEffect('c', 11))
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

addLayer("i", {
    name: "ideas", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "I", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		best: new Decimal(0),
		points: new Decimal(0),
    }},
    color: "#fad682",
    requires() { return new Decimal(2500).times((hasAchievement("a", 21)&&!player.i.unlocked)?1e10:1) },
    resource: "ideas", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    branches: ["c"],
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.4, // Prestige currency exponent
    rev() { 
        rev = player.c.points.add(1).log(2).add(1).times(player.i.points.add(1))
        if (hasMilestone("i", 0)) rev = rev.pow(2)
        return rev
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        exp = new Decimal(1)
        return exp
    },
	tabFormat: ["main-display",
		"prestige-button",
		"resource-display", 
        "blank", 
		"milestones", 
        "blank", 
        "blank",
		["display-text", function() { return "Revelations: <h2>"+formatWhole(tmp.i.rev)+"</h2>"+"(based on Ideas & Population)" }],
		// Add this when revs have an effect ["display-text", function() { return "Effect: Multiply Mech-Energy by <h2>"+format(tmp.id.revEff)+"</h2>." } ], "blank",
	],
    milestones: {
		0: {
			requirementDescription: "4 Ideas",
			done() { return player.i.best.gte(4) },
			effectDescription: "Square revelation gain.",
		},
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "i", description: "I: Perform a row 2 reset for ideas", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasAchievement('a', 13)},
})

addLayer("a", {
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    startData() { return {
        unlocked: true,
    }},
    color: "#FFFF00",
    row: "side", // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
    tooltip() { // Optional, tooltip displays when the layer is locked
        return ("Achievements")
    },
    achievements: {
        rows: 1,
        cols: 3,
        11: {
            name: "Existence was a Mistake",
		    done() { return player.c.points.gte(1) },
		    tooltip: "Have a population of at least 1.",
        },
        12: {
            name: "Getting Bored?",
		    done() { return player.c.points.gte(5) },
		    tooltip: "Have a population of at least 5. Reward: You can buy max Population.",
        },
        13: {
            name: "Planning for Success.",
		    done() { return player.points.gte(2500) },
		    tooltip: "Reach 2,500 points. Reward: Reveals row 2 layers.",
        },
    },
	tabFormat: [
		"blank", 
		["display-text", function() { return "Achievements: "+player.a.achievements.length+"/"+(Object.keys(tmp.a.achievements).length-2) }], 
		"blank", "blank",
		"achievements",
	],
})