'use client';

import { ExternalLink, Github, Construction, PowerOff } from 'lucide-react';
import type { Project } from '../data/projects';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="glass p-5 flex flex-col gap-3 group transition-all duration-300 hover:translate-y-[-2px]">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-white text-sm">{project.name}</h3>
          {project.wip && (
            <span className="inline-flex items-center gap-1 text-[10px] text-white/50 bg-white/5 px-1.5 py-0.5 rounded-full">
              <Construction size={8} />
              wip
            </span>
          )}
          {project.shutdown && (
            <span className="inline-flex items-center gap-1 text-[10px] text-white/30 bg-white/5 px-1.5 py-0.5 rounded-full">
              <PowerOff size={8} />
              shutdown
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white transition-colors"
            >
              <ExternalLink size={14} />
            </a>
          )}
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white transition-colors"
            >
              <Github size={14} />
            </a>
          )}
        </div>
      </div>

      <p className="text-xs text-white/40 leading-relaxed">{project.description}</p>

      <div className="flex flex-wrap gap-1.5 mt-auto">
        {project.tags.map(tag => (
          <span
            key={tag}
            className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/5"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
