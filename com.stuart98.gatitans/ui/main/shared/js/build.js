var Build = (function() {
    var FALLBACK_ICON = 'coui://ui/main/game/live_game/img/build_bar/img_missing_unit.png';
    var pathWithoutExtensionMatch = /(.*)\.json[^\/]*$/;

    var iconForSpecId = function(id)
    {
        var match = null;
        if (id)
            match = pathWithoutExtensionMatch.exec(id);

        if (_.size(match) < 2)
            return FALLBACK_ICON;

        return 'coui:/' + match[1] + '_icon_buildbar.png';
    };

    var iconForUnit = function (unit)
    {
        if (!unit)
            return FALLBACK_ICON;
        return iconForSpecId(unit.id);
    };

    var HotkeyModel = function() {
        var self = this;

        self.SpecIdToGridMap = ko.observable(
            {
                "/pa/units/land/titan_structure/titan_structure.json": ["utility", 6],
                "/pa/units/land/control_module/control_module.json": ["utility", 7],
                "/pa/units/land/radar_adv/radar_adv.json": ["utility", 8],
		"/pa/units/sea/sonar_adv/sonar_adv.json": ["utility", 9],
                "/pa/units/land/energy_plant_adv/energy_plant_adv.json": ["utility", 10],
                "/pa/units/land/metal_extractor_adv/metal_extractor_adv.json": ["utility", 11],
                "/pa/units/orbital/delta_v_engine/delta_v_engine.json": ["utility", 12],
		"/pa/units/orbital/deep_space_radar/deep_space_radar.json": ["utility", 13],
                "/pa/units/land/land_barrier/land_barrier.json": ["utility", 14],
		"/pa/units/land/engineering_station/engineering_station.json": ["utility", 15],
                "/pa/units/land/energy_storage/energy_storage.json": ["utility", 16],
                "/pa/units/land/metal_storage/metal_storage.json": ["utility", 17],
                "/pa/units/orbital/deep_space_radar_basic/deep_space_radar_basic.json": ["utility", 18],
                "/pa/units/land/teleporter/teleporter.json": ["utility", 19],
                "/pa/units/land/radar/radar.json": ["utility", 20],
		"/pa/units/sea/sonar/sonar.json": ["utility", 21],
                "/pa/units/land/energy_plant/energy_plant.json": ["utility", 22],
                "/pa/units/land/metal_extractor/metal_extractor.json": ["utility", 23],


		"/pa/units/sea/battleship/battleship.json": ["factory", 8],
		"/pa/units/air/titan_air/titan_air.json": ["factory", 9],
                "/pa/units/land/titan_bot/titan_bot.json": ["factory", 10],
                "/pa/units/land/titan_vehicle/titan_vehicle.json": ["factory", 11],
                "/pa/units/land/unit_cannon/unit_cannon.json": ["factory", 13],
                "/pa/units/sea/naval_factory_adv/naval_factory_adv.json": ["factory", 14],
                "/pa/units/air/air_factory_adv/air_factory_adv.json": ["factory", 15],
                "/pa/units/land/bot_factory_adv/bot_factory_adv.json": ["factory", 16],
                "/pa/units/land/vehicle_factory_adv/vehicle_factory_adv.json": ["factory", 17],
                "/pa/units/orbital/orbital_launcher/orbital_launcher.json": ["factory", 19],
                "/pa/units/sea/naval_factory/naval_factory.json": ["factory", 20],
                "/pa/units/air/air_factory/air_factory.json": ["factory", 21],
                "/pa/units/land/bot_factory/bot_factory.json": ["factory", 22],
                "/pa/units/land/vehicle_factory/vehicle_factory.json": ["factory", 23],


		"/pa/units/land/apocalypse_apparatus/apocalypse_apparatus.json": ["combat", 6],
                "/pa/units/land/laser_defense_adv/laser_defense_adv.json": ["combat", 7],
		"/pa/units/land/laser_defense_sniper/laser_defense_sniper.json": ["combat", 8],
                "/pa/units/land/artillery_long/artillery_long.json": ["combat", 9],
                "/pa/units/land/air_defense_adv/air_defense_adv.json": ["combat", 10],
                "/pa/units/land/tactical_missile_launcher/tactical_missile_launcher.json": ["combat", 11],
                "/pa/units/land/nuke_launcher/nuke_launcher.json": ["combat", 13],
                "/pa/units/land/laser_defense/laser_defense.json": ["combat", 12],
                "/pa/units/land/air_defense/air_defense.json": ["combat", 14],
                "/pa/units/land/artillery_unit_launcher/artillery_unit_launcher.json": ["combat", 15],
                "/pa/units/sea/torpedo_launcher_adv/torpedo_launcher_adv.json": ["combat", 16],
                "/pa/units/land/anti_nuke_launcher/anti_nuke_launcher.json": ["combat", 17],
                "/pa/units/land/laser_defense_single/laser_defense_single.json": ["combat", 18],
		"/pa/units/land/rocket_defense/rocket_defense.json": ["combat", 20],
                "/pa/units/land/artillery_short/artillery_short.json": ["combat", 21],
                "/pa/units/sea/torpedo_launcher/torpedo_launcher.json": ["combat", 22],
                "/pa/units/orbital/ion_defense/ion_defense.json": ["combat", 23],


                "/pa/units/land/tank_nuke/tank_nuke.json": ["vehicleadv", 12],
                "/pa/units/sea/hover_ship/hover_ship.json": ["vehicleadv",13],
                "/pa/units/land/tank_orbital/tank_orbital.json": ["vehicleadv", 14],
                "/pa/units/land/fabrication_vehicle_adv/fabrication_vehicle_adv.json": ["vehicleadv", 18],
                "/pa/units/land/tank_laser_adv/tank_laser_adv.json": ["vehicleadv", 19],
                "/pa/units/land/tank_armor/tank_armor.json": ["vehicleadv", 20],
		"/pa/units/land/hover_artillery/hover_artillery.json": ["vehicleadv", 21],
                "/pa/units/land/tank_heavy_mortar/tank_heavy_mortar.json": ["vehicleadv", 22],
                "/pa/units/land/tank_flak/tank_flak.json": ["vehicleadv", 23],
                
                "/pa/units/land/fabrication_vehicle/fabrication_vehicle.json": ["vehicle", 18],
                "/pa/units/land/tank_light_laser/tank_light_laser.json": ["vehicle", 12],
                "/pa/units/land/tank_heavy_armor/tank_heavy_armor.json": ["vehicle", 13],
                "/pa/units/land/land_scout/land_scout.json": ["vehicle", 14],
				"/pa/units/land/fabrication_vehicle_combat/fabrication_vehicle_combat.json": ["vehicle", 15],
		"/pa/units/land/tank_attack/tank_attack.json": ["vehicle", 19],
                "/pa/units/land/aa_missile_vehicle/aa_missile_vehicle.json": ["vehicle", 20],
		"/pa/units/land/hover_aa/hover_aa.json": ["vehicle", 21],
		"/pa/units/land/tank_heavy_artillery/tank_heavy_artillery.json": ["vehicle", 22],
                "/pa/units/land/tank_hover/tank_hover.json": ["vehicle", 23],


                "/pa/units/land/bot_support_commander/bot_support_commander.json": ["botadv", 13],
		"/pa/units/land/bot_ubercannon/bot_ubercannon.json": ["botadv", 14],
		"/pa/units/land/raptor_bot_1/raptor_bot_1.json": ["botadv", 15],
                "/pa/units/land/bot_nanoswarm/bot_nanoswarm.json": ["botadv", 12],           
                "/pa/units/land/fabrication_bot_adv/fabrication_bot_adv.json": ["botadv", 18],
                "/pa/units/land/assault_bot_adv/assault_bot_adv.json": ["botadv", 19],
		"/pa/units/land/bot_aa_adv/bot_aa_adv.json": ["botadv", 20],
                "/pa/units/land/bot_sniper/bot_sniper.json": ["botadv", 21],
                "/pa/units/land/fabrication_bot_combat/fabrication_bot_combat.json": ["botadv", 22],
                "/pa/units/land/bot_tactical_missile/bot_tactical_missile.json": ["botadv", 23],

                "/pa/units/land/fabrication_bot/fabrication_bot.json": ["bot", 18],
		"/pa/units/land/bot_raider/bot_raider.json": ["bot", 20],
		"/pa/units/land/amphibious_fabricator/amphibious_fabricator.json": ["bot", 19],
                "/pa/units/land/assault_bot/assault_bot.json": ["bot", 13],
		"/pa/units/land/bot_arty/bot_arty.json": ["bot", 14],
		"/pa/units/land/bot_mortar/bot_mortar.json": ["bot", 15],
		"/pa/units/land/bot_orbital/bot_orbital.json": ["bot", 16],
                "/pa/units/land/bot_grenadier/bot_grenadier.json": ["bot", 21],
                "/pa/units/land/fabrication_bot_combat_adv/fabrication_bot_combat_adv.json": ["bot", 22],
                "/pa/units/land/bot_bomb/bot_bomb.json": ["bot", 23],
                "/pa/units/land/bot_tesla/bot_tesla.json": ["bot", 12],


                "/pa/units/air/support_platform/support_platform.json": ["airadv", 12],
                "/pa/units/air/fabrication_aircraft_adv/fabrication_aircraft_adv.json": ["airadv", 18],
                "/pa/units/air/fighter_adv/fighter_adv.json": ["airadv", 19],
		"/pa/units/air/bomber_naval/bomber_naval.json": ["airadv", 20],
                "/pa/units/air/gunship/gunship.json": ["airadv", 21],
                "/pa/units/air/bomber_adv/bomber_adv.json": ["airadv", 22],
                "/pa/units/air/bomber_heavy/bomber_heavy.json": ["airadv", 23],
 
                "/pa/units/air/fabrication_aircraft/fabrication_aircraft.json": ["air", 18],
                "/pa/units/air/fighter/fighter.json": ["air", 12],
		"/pa/units/air/fighter_beam/fighter_beam.json": ["air", 19],
                "/pa/units/air/bomber/bomber.json": ["air", 20],
                "/pa/units/air/air_scout/air_scout.json": ["air", 23],
                "/pa/units/air/transport/transport.json": ["air", 22],
                "/pa/units/air/solar_drone/solar_drone.json": ["air", 21],

     

                "/pa/units/sea/drone_carrier/carrier/carrier.json": ["seaadv",23],
                "/pa/units/sea/fabrication_ship_adv/fabrication_ship_adv.json": ["seaadv",18],
                "/pa/units/sea/battlecruiser/battlecruiser.json": ["seaadv", 19],
                "/pa/units/sea/missile_ship/missile_ship.json": ["seaadv", 20],
                "/pa/units/sea/nuclear_sub/nuclear_sub.json": ["seaadv", 21],
                "/pa/units/sea/frigate/frigate.json": ["seaadv", 22],

		 
                "/pa/units/sea/boat_torpedo/boat_torpedo.json": ["sea", 20],
                "/pa/units/sea/destroyer/destroyer.json": ["sea", 21],
                "/pa/units/sea/attack_sub/attack_sub.json": ["sea", 22],
                "/pa/units/sea/sea_scout/sea_scout.json": ["sea", 19],
		"/pa/units/sea/fabrication_sub/fabrication_sub.json": ["sea", 23],
                "/pa/units/sea/fabrication_barge/fabrication_barge.json": ["sea",18],


                "/pa/units/orbital/titan_orbital/titan_orbital.json": ["orbital_structure", 6],
                "/pa/units/orbital/defense_satellite/defense_satellite.json": ["orbital_structure", 12],
                "/pa/units/orbital/mining_platform/mining_platform.json": ["orbital_structure", 13],
                "/pa/units/orbital/solar_array/solar_array.json": ["orbital_structure", 14],
                "/pa/units/orbital/orbital_factory/orbital_factory.json": ["orbital_structure", 15],
                "/pa/units/orbital/radar_satellite_adv/radar_satellite_adv.json": ["orbital_structure", 16],
                

                "/pa/units/orbital/orbital_battleship/orbital_battleship.json": ["orbital", 12],
                "/pa/units/orbital/orbital_laser/orbital_laser.json": ["orbital", 13],
                "/pa/units/orbital/orbital_railgun/orbital_railgun.json": ["orbital", 14],
                "/pa/units/orbital/orbital_fabrication_bot/orbital_fabrication_bot.json": ["orbital", 18],
                "/pa/units/orbital/orbital_fighter/orbital_fighter.json": ["orbital", 19],
                "/pa/units/orbital/radar_satellite/radar_satellite.json": ["orbital", 20],
                "/pa/units/orbital/orbital_lander/orbital_lander.json": ["orbital", 21],
                "/pa/units/orbital/orbital_probe/orbital_probe.json": ["orbital", 22],

                "/pa/units/land/land_mine/land_mine.json": ["ammo", 14],
                "/pa/units/land/anti_nuke_launcher/anti_nuke_launcher_ammo.json": ["ammo", 15],
                "/pa/units/land/nuke_launcher/nuke_launcher_ammo.json": ["ammo", 16]
            }
        );
    };

    return {
        iconForSpecId: iconForSpecId,
        iconForUnit: iconForUnit,
        HotkeyModel: HotkeyModel,
    };
})();
