"use client";

import type { Exhibit } from "@/lib/museum/types";
import { EndlessCascadeStage } from "@/components/wings/EndlessCascadeStage";
import { ClosedTreadStage } from "@/components/wings/ClosedTreadStage";
import { FountainKnotStage } from "@/components/wings/FountainKnotStage";
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
import { ArchivePlateStage } from "@/components/museum/ArchivePlateViewer";

export function ExhibitStage({
  exhibit,
  expanded = false,
}: {
  exhibit: Exhibit;
  expanded?: boolean;
}) {
  const id = exhibit.id;
  switch (exhibit.engine) {
    case "endless-cascade":
      return <EndlessCascadeStage expanded={expanded} exhibitId={id} />;
    case "closed-tread":
      return <ClosedTreadStage expanded={expanded} exhibitId={id} />;
    case "fountain-knot":
      return <FountainKnotStage expanded={expanded} exhibitId={id} />;
    case "pts-locus":
      return <PtsLocusStage expanded={expanded} />;
    case "flow-field":
      return <FlowFieldStage expanded={expanded} exhibitId={id} />;
    case "joy-division":
      return <JoyDivisionStage expanded={expanded} exhibitId={id} />;
    case "circle-pack":
      return <CirclePackStage expanded={expanded} exhibitId={id} />;
    case "tiled-lines":
      return <TiledLinesStage expanded={expanded} />;
    case "strange-attractor":
      return <StrangeAttractorStage expanded={expanded} exhibitId={id} />;
    case "alcove-ribbon":
      return <AlcoveRibbon expanded={expanded} exhibitId={id} />;
    case "alcove-crystal":
      return <AlcoveCrystal expanded={expanded} exhibitId={id} />;
    case "alcove-orb":
      return <AlcoveOrb expanded={expanded} exhibitId={id} />;
    case "ember-wake":
      return <EmberWakeStage exhibitId={id} expanded={expanded} />;
    case "iron-lattice":
      return <IronLatticeStage exhibitId={id} expanded={expanded} />;
    case "harmonic-sheet":
      return <HarmonicSheetStage expanded={expanded} exhibitId={id} />;
    case "particle-life":
      return <ParticleLifeStage exhibitId={id} expanded={expanded} />;
    case "reaction-diffusion":
      return <ReactionDiffusionStage exhibitId={id} expanded={expanded} />;
    case "spektral-pulse":
      return <SpektralPulse exhibitId={id} expanded={expanded} />;
    case "meteor":
      return <MeteorStage exhibitId={id} expanded={expanded} />;
    case "plotter-arm":
      return <PlotterArmStage exhibitId={id} expanded={expanded} />;
    case "cam-press":
      return <CamPressStage exhibitId={id} expanded={expanded} />;
    case "sand-pendulum":
      return <SandPendulumStage exhibitId={id} expanded={expanded} />;
    case "archive-plates":
      return (
        <ArchivePlateStage folder={exhibit.archive ?? "reel-ember"} expanded={expanded} />
      );
    default:
      return <div className="grid h-full place-items-center text-[var(--paper)]">No engine</div>;
  }
}
