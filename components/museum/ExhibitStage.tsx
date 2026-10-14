"use client";

import type { Exhibit } from "@/lib/museum/types";
import { BrixelLifeStage } from "@/components/wings/BrixelLifeStage";
import { FlipFieldStage } from "@/components/wings/FlipFieldStage";
import { NeedleChorusStage } from "@/components/wings/NeedleChorusStage";
import { PtsLocusStage } from "@/components/wings/PtsLocusStage";
import { FlowFieldStage } from "@/components/wings/FlowFieldStage";
import { AlcoveRibbon } from "@/components/wings/AlcoveRibbon";
import { AlcoveCrystal } from "@/components/wings/AlcoveCrystal";
import { AlcoveOrb } from "@/components/wings/AlcoveOrb";
import { EmberWakeStage } from "@/components/wings/EmberWakeStage";
import { IronLatticeStage } from "@/components/wings/IronLatticeStage";
import { HarmonicSheetStage } from "@/components/wings/HarmonicSheetStage";
import { ParticleLifeStage } from "@/components/wings/ParticleLifeStage";
import { SpektralPulse } from "@/components/wings/SpektralPulse";
import { JoyDivisionStage } from "@/components/wings/JoyDivisionStage";
import { CirclePackStage } from "@/components/wings/CirclePackStage";
import { ReactionDiffusionStage } from "@/components/wings/ReactionDiffusionStage";
import { TiledLinesStage } from "@/components/wings/TiledLinesStage";
import { StrangeAttractorStage } from "@/components/wings/StrangeAttractorStage";
import { MeteorStage } from "@/components/wings/MeteorStage";
import { PlotterArmStage } from "@/components/wings/PlotterArmStage";
import { CamPressStage } from "@/components/wings/CamPressStage";
import { SandPendulumStage } from "@/components/wings/SandPendulumStage";

export function ExhibitStage({
  exhibit,
  expanded = false,
}: {
  exhibit: Exhibit;
  expanded?: boolean;
}) {
  switch (exhibit.engine) {
    case "brixel-life":
      return <BrixelLifeStage expanded={expanded} />;
    case "flip-field":
      return <FlipFieldStage expanded={expanded} />;
    case "needle-chorus":
      return <NeedleChorusStage expanded={expanded} />;
    case "pts-locus":
      return <PtsLocusStage />;
    case "flow-field":
      return <FlowFieldStage />;
    case "joy-division":
      return <JoyDivisionStage />;
    case "circle-pack":
      return <CirclePackStage />;
    case "tiled-lines":
      return <TiledLinesStage />;
    case "strange-attractor":
      return <StrangeAttractorStage />;
    case "alcove-ribbon":
      return <AlcoveRibbon expanded={expanded} />;
    case "alcove-crystal":
      return <AlcoveCrystal expanded={expanded} />;
    case "alcove-orb":
      return <AlcoveOrb expanded={expanded} />;
    case "ember-wake":
      return <EmberWakeStage />;
    case "iron-lattice":
      return <IronLatticeStage />;
    case "harmonic-sheet":
      return <HarmonicSheetStage expanded={expanded} />;
    case "particle-life":
      return <ParticleLifeStage />;
    case "reaction-diffusion":
      return <ReactionDiffusionStage />;
    case "spektral-pulse":
      return <SpektralPulse />;
    case "meteor":
      return <MeteorStage />;
    case "plotter-arm":
      return <PlotterArmStage />;
    case "cam-press":
      return <CamPressStage />;
    case "sand-pendulum":
      return <SandPendulumStage />;
    default:
      return <div className="grid h-full place-items-center text-[var(--paper)]">No engine</div>;
  }
}
