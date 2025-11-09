import { Button } from '../../components/Button';
import s from './Button.module.scss';

export default function ButtonPage() {
  return (
    <section>
      <h2>Button</h2>
      <p>Exemplo simples do componente Button:</p>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        {/*<Button label="Button" onClick={() => alert('Button clicado!')} />*/}
        {/*<Button*/}
        {/*  label="Com ícone"*/}
        {/*  icon={<span aria-hidden>⭐</span>}*/}
        {/*  onClick={() => alert('Com ícone')}*/}
        {/*/>*/}
        {/*<Button*/}
        {/*  aria-label="Icon only"*/}
        {/*  icon={<span aria-hidden>🔔</span>}*/}
        {/*  onClick={() => alert('Somente ícone')}*/}
        {/*/>*/}
        <div className={s['interaction-state']}>
          <h3>Interaction States - Primary (Solid)</h3>
          <div className={s['example-states']}>
            <Button label="Rest" tone="solid" semantic="primary" />
            <Button label="Hover" tone="solid" semantic="primary" status="hover" />
            <Button label="Focus" tone="solid" semantic="primary" status="focus" />
            <Button label="Pressed" tone="solid" semantic="primary" status="pressed" />
            <Button label="Selected" tone="solid" semantic="primary" controlState={true} />
            <Button label="Disabled" tone="solid" semantic="primary" status="disabled" />
          </div>
        </div>
        <div className={s['interaction-state']}>
          <h3>Interaction States - Primary (Soft)</h3>
          <div className={s['example-states']}>
            <Button label="Rest" tone="soft" semantic="primary" />
            <Button label="Hover" tone="soft" semantic="primary" status="hover" />
            <Button label="Focus" tone="soft" semantic="primary" status="focus" />
            <Button label="Pressed" tone="soft" semantic="primary" status="pressed" />
            <Button label="Selected" tone="soft" semantic="primary" controlState={true} />
            <Button label="Disabled" tone="soft" semantic="primary" status="disabled" />
          </div>
        </div>
        <div className={s['interaction-state']}>
          <h3>Interaction States - Neutral (Soft)</h3>
          <div className={s['example-states']}>
            <Button label="Rest" tone="soft" />
            <Button label="Hover" tone="soft" status="hover" />
            <Button label="Focus" tone="soft" status="focus" />
            <Button label="Pressed" tone="soft" status="pressed" />
            <Button label="Selected" tone="soft" controlState={true} />
            <Button label="Disabled" tone="soft" status="disabled" />
          </div>
        </div>
        <div className={s['interaction-state']}>
          <h3>Interaction States - Destructive (Solid)</h3>
          <div className={s['example-states']}>
            <Button label="Rest" tone="solid" semantic="redLike" />
            <Button label="Hover" tone="solid" semantic="redLike" status="hover" />
            <Button label="Focus" tone="solid" semantic="redLike" status="focus" />
            <Button label="Pressed" tone="solid" semantic="redLike" status="pressed" />
            <Button label="Selected" tone="solid" semantic="redLike" controlState={true} />
            <Button label="Disabled" tone="solid" semantic="redLike" status="disabled" />
          </div>
        </div>
        <div className={s['interaction-state']}>
          <h3>Interaction States - Destructive (Soft)</h3>
          <div className={s['example-states']}>
            <Button label="Rest" tone="soft" semantic="redLike" />
            <Button label="Hover" tone="soft" semantic="redLike" status="hover" />
            <Button label="Focus" tone="soft" semantic="redLike" status="focus" />
            <Button label="Pressed" tone="soft" semantic="redLike" status="pressed" />
            <Button label="Selected" tone="soft" semantic="redLike" controlState={true} />
            <Button label="Disabled" tone="soft" semantic="redLike" status="disabled" />
          </div>
        </div>

        <div className={s['interaction-state']}>
          <h3>Size: small</h3>
          <div className={s['example-states']}>
            <Button label="Small 2" scale="s:sm:2" />
            <Button label="Small" scale="s:sm:1" />
            <Button label="Medium" scale="s:md:1" />
            <Button label="Large" scale="s:lg:1" />
            <Button label="Large 2" scale="s:lg:2" />
            <Button label="Large 3" scale="s:lg:3" />
          </div>
        </div>
        <div>
          <h3>Selected</h3>
          <Button label="Rest" controlState={true} />
          <Button label="Hover" status="hover" controlState={true} />
          <Button label="Focus" status="focus" controlState={true} />
          <Button label="Pressed" status="pressed" controlState={true} />
        </div>
        <div>
          <h3>Scale</h3>
          <Button label="Small" scale="s:sm:1" />
          <Button label="Medium" scale="s:md:1" />
          <Button label="Large" scale="s:lg:1" />
        </div>
        <div>
          <h3>Shadow</h3>
          <Button label="Rest" shadow={true} />
          <Button label="Hover" shadow={true} status={'hover'} />
          <Button label="Focus" shadow={true} status={'focus'} />
          <Button label="Pressed" shadow={true} status={'pressed'} />
          <Button label="Disabled" shadow={true} status={'disabled'} />
        </div>
      </div>
    </section>
  );
}
