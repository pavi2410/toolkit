import { useStore } from '@nanostores/react'
import { $transforms, actions } from '@/stores/image-editor'
import { Button, Slider } from '@heroui/react'
import IconRotateClockwise from '~icons/tabler/rotate-clockwise'
import IconRotate from '~icons/tabler/rotate'
import IconFlipHorizontal from '~icons/tabler/flip-horizontal'
import IconFlipVertical from '~icons/tabler/flip-vertical'

type Adjustment = 'brightness' | 'contrast' | 'saturation'

function AdjustSlider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <Slider
      value={value}
      onChange={(next) => onChange(Array.isArray(next) ? next[0] : next)}
      minValue={-100}
      maxValue={100}
      step={1}
    >
      <div className="flex justify-between mb-1">
        <span className="text-xs font-medium text-foreground">{label}</span>
        <button
          className="text-xs text-muted tabular-nums hover:text-foreground transition-colors"
          onClick={() => onChange(0)}
          title="Click to reset"
        >
          {value > 0 ? '+' : ''}{value}
        </button>
      </div>
      <Slider.Track>
        <Slider.Fill />
        <Slider.Thumb />
      </Slider.Track>
    </Slider>
  )
}

export default function AdjustPanel() {
  const transforms = useStore($transforms)

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-medium text-foreground mb-2">Rotation</label>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onPress={() => actions.rotate('ccw')} className="flex-1 gap-1.5">
            <IconRotate className="w-4 h-4" /> −90°
          </Button>
          <Button variant="secondary" size="sm" onPress={() => actions.rotate('cw')} className="flex-1 gap-1.5">
            <IconRotateClockwise className="w-4 h-4" /> +90°
          </Button>
        </div>
        {transforms.rotation !== 0 && (
          <p className="text-xs text-muted mt-1 text-center">Current: {transforms.rotation}°</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-foreground mb-2">Flip</label>
        <div className="flex gap-2">
          <Button
            variant={transforms.flipH ? 'secondary' : 'tertiary'}
            size="sm"
            onPress={() => actions.flip('h')}
            className="flex-1 gap-1.5"
          >
            <IconFlipHorizontal className="w-4 h-4" /> Horizontal
          </Button>
          <Button
            variant={transforms.flipV ? 'secondary' : 'tertiary'}
            size="sm"
            onPress={() => actions.flip('v')}
            className="flex-1 gap-1.5"
          >
            <IconFlipVertical className="w-4 h-4" /> Vertical
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {(['brightness', 'contrast', 'saturation'] as Adjustment[]).map(key => (
          <AdjustSlider
            key={key}
            label={key.charAt(0).toUpperCase() + key.slice(1)}
            value={transforms[key]}
            onChange={v => actions.setAdjustment(key, v)}
          />
        ))}
      </div>

      {(transforms.brightness !== 0 || transforms.contrast !== 0 || transforms.saturation !== 0) && (
        <Button variant="ghost" size="sm" onPress={actions.resetAdjustments} className="w-full text-danger">
          Reset adjustments
        </Button>
      )}
    </div>
  )
}
